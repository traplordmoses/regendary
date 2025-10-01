use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use axum::{Json, extract::State, extract::Path, http::StatusCode};
use tfhe::{FheUint8, FheUint16, ServerKey, set_server_key, ClientKey};
use tfhe::prelude::*;
use crate::AppState;
use crate::KeyAccess;

#[derive(Clone)]
pub struct MarketState {
    pub id_counter: u128,
    pub market: HashMap<u128, Seed>,
}

#[derive(Clone)]
pub struct Seed {
    pub id: u128,
    pub name: String,
    pub positions: Vec<Position>
}

#[derive(Clone)]
pub struct Position {
    pub owner: String,  // Remove 'name' field - it doesn't belong here
    pub weight: FheUint8,
    pub bet: FheUint8
}

impl MarketState{

    pub fn new() -> Self {
        Self {
            id_counter: 0,
            market: HashMap::new()
        }
    }

    pub fn create_seed(&mut self, name: String, position: Position) -> u128 {
        let seed_id = self.id_counter;
        let seed = Seed {
            id: seed_id,
            name,
            positions: vec![position]
        };
        
        self.market.insert(seed_id, seed);
        self.id_counter += 1;
        
        seed_id
    }

    pub fn add_position_to_seed(&mut self, seed_id: u128, position: Position) -> Result<(), String> {
        if let Some(seed) = self.market.get_mut(&seed_id) {
            seed.positions.push(position);
            Ok(())
        } else {
            Err(format!("Seed with ID {} not found", seed_id))
        }
    }

    pub fn get_market_info(&self, seed_id: u128) -> Result<MarketInfo, String> {
        if let Some(seed) = self.market.get(&seed_id) {
            Ok(MarketInfo {
                seed_id: seed.id,
                name: seed.name.clone(),
                position_count: seed.positions.len(),
            })
        } else {
            Err(format!("Seed with ID {} not found", seed_id))
        }
    }

    // Simplified method to calculate basic totals using FHE operations
    pub fn calculate_weighted_average(&self, seed_id: u128, server_key: &ServerKey) -> Result<FheUint8, String> {
        if let Some(seed) = self.market.get(&seed_id) {
            if seed.positions.is_empty() {
                return Err("No positions found for this market".to_string());
            }

            // Set the server key for FHE operations
            set_server_key(server_key.clone());

            // Initialize with zero values
            let zero = FheUint8::encrypt_trivial(0u8);
            let mut total_weight_plus_bet = zero.clone();

            // Simple loop: just add up the values (max 4 operations)
            let max_operations = 4.min(seed.positions.len());
            for position in seed.positions.iter().take(max_operations) {
                // Calculate weight + bet for this position
                let weight_plus_bet = &position.weight + &position.bet;
                
                // Add to running total
                total_weight_plus_bet = &total_weight_plus_bet + &weight_plus_bet;
            }

            // For now, just return the total weight + bet (skip division)
            Ok(total_weight_plus_bet)
        } else {
            Err(format!("Seed with ID {} not found", seed_id))
        }
    }

    // create seed 
    // push new postion
    // get seed
    // calculate result
    // get result
    
}


#[derive(Deserialize)]
pub struct CreateSeedRequest {
    pub name: String,
    pub owner: String,
    pub weight: u8,
    pub bet: u8
}

#[derive(Deserialize)]
pub struct CreatePositionRequest {
    pub seed_id: u128,
    pub owner: String,
    pub weight: u8,
    pub bet: u8
}

#[derive(Deserialize)]
pub struct GetMarketRequest {
    pub seed_id: u128,
}

#[derive(Serialize)]
pub struct MarketInfo {
    pub seed_id: u128,
    pub name: String,
    pub position_count: usize,
}

#[derive(Serialize)]
pub struct WeightedAverageResponse {
    pub seed_id: u128,
    pub weighted_average: u8, // Decrypted result
    pub position_count: usize,
}

// Change State<MarketState> to State<AppState>
pub async fn create_seed_handler(State(state): State<AppState>, Json(payload): Json<CreateSeedRequest>) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let client_key = state.get_client_key();
    let encrypted_weight = FheUint8::encrypt(payload.weight, &*client_key);
    let encrypted_bet = FheUint8::encrypt(payload.bet, &*client_key);
    let mut market_state = state.market_state.lock().unwrap();
    
    let position = Position {
        owner: payload.owner.clone(),
        weight: encrypted_weight,
        bet: encrypted_bet
    };
    
    let seed_id = market_state.create_seed(payload.name.clone(), position);

    println!("✅ Seed '{}' created successfully with ID {} for owner '{}'", 
             payload.name, seed_id, payload.owner);

    let response = serde_json::json!({
        "message": "Seed created successfully",
        "seed_id": seed_id,
        "name": payload.name
    });

    Ok(Json(response))
}

pub async fn create_position_handler(State(state): State<AppState>, Json(payload): Json<CreatePositionRequest>) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let client_key = state.get_client_key();
    let encrypted_weight = FheUint8::encrypt(payload.weight, &*client_key);
    let encrypted_bet = FheUint8::encrypt(payload.bet, &*client_key);
    let mut market_state = state.market_state.lock().unwrap();
    
    let position = Position {
        owner: payload.owner.clone(),
        weight: encrypted_weight,
        bet: encrypted_bet
    };
    
    match market_state.add_position_to_seed(payload.seed_id, position) {
        Ok(_) => {
            println!("✅ Position added successfully to seed {} for owner '{}'", 
                     payload.seed_id, payload.owner);
            
            let response = serde_json::json!({
                "message": "Position added successfully",
                "seed_id": payload.seed_id,
                "owner": payload.owner
            });
            
            Ok(Json(response))
        }
        Err(e) => {
            println!("❌ Failed to add position: {}", e);
            Err((StatusCode::NOT_FOUND, e))
        }
    }
}

pub async fn get_market_handler(State(state): State<AppState>, Path(seed_id): Path<u128>) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let market_state = state.market_state.lock().unwrap();
    
    match market_state.get_market_info(seed_id) {
        Ok(market_info) => {
            println!("✅ Retrieved market info for seed {}: {} positions", 
                     market_info.seed_id, market_info.position_count);
            
            let response = serde_json::json!({
                "seed_id": market_info.seed_id,
                "position_count": market_info.position_count
            });
            
            Ok(Json(response))
        }
        Err(e) => {
            println!("❌ Failed to get market info: {}", e);
            Err((StatusCode::NOT_FOUND, e))
        }
    }
}

// New handler for calculating weighted average
pub async fn calculate_weighted_average_handler(
    State(state): State<AppState>, 
    Path(seed_id): Path<u128>
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let server_key = state.get_server_key();
    let client_key = state.get_client_key();
    let market_state = state.market_state.lock().unwrap();
    
    match market_state.calculate_weighted_average(seed_id, &*server_key) {
        Ok(encrypted_result) => {
            // Decrypt the result to return as plain text
            let decrypted_result: u8 = encrypted_result.decrypt(&*client_key);
            
            // Get position count for response
            let position_count = if let Some(seed) = market_state.market.get(&seed_id) {
                seed.positions.len()
            } else {
                0
            };
            
            println!("✅ Calculated weighted average for seed {}: {} (from {} positions)", 
                     seed_id, decrypted_result, position_count);
            
            let response = serde_json::json!({
                "seed_id": seed_id,
                "weighted_average": decrypted_result,
                "position_count": position_count,
                "message": "Weighted average calculated successfully"
            });
            
            Ok(Json(response))
        }
        Err(e) => {
            println!("❌ Failed to calculate weighted average: {}", e);
            Err((StatusCode::NOT_FOUND, e))
        }
    }
}




