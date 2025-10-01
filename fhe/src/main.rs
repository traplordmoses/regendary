use axum::{
    routing::{get, post}, Router, extract::State,
    http::{HeaderMap, Method, Request, Response, StatusCode},
    middleware::{self, Next},
    response::IntoResponse,
    Json, extract::Path,
};
use std::sync::Arc;
use tfhe::{
    FheUint8,
    CompressedCiphertextListBuilder,
    set_server_key,
};
use tfhe::prelude::*;
use tfhe::{ServerKey, ClientKey};
use serde::Deserialize;
use std::sync::Mutex;
mod fhe;
mod handlers;
use handlers::pred::MarketState;

#[derive(Clone)]
pub struct AppState {
    server_key: Arc<ServerKey>,
    client_key: Arc<ClientKey>,
    market_state: Arc<Mutex<MarketState>>,
}

pub trait KeyAccess {
    fn get_server_key(&self) -> Arc<ServerKey>;
    fn get_client_key(&self) -> Arc<ClientKey>;
}

impl KeyAccess for AppState {
    fn get_server_key(&self) -> Arc<ServerKey> {
        self.server_key.clone()
    }
    fn get_client_key(&self) -> Arc<ClientKey> {
        self.client_key.clone()
    }
}


#[tokio::main]
async fn main() {

    if let Err(e) = fhe::key_gen::generate_and_save_keys() {
        eprintln!("Failed to generate keys: {}", e);
        return;
    }

    let marketState = MarketState::new();

    let state = AppState {
        server_key: Arc::new(fhe::key_gen::load_server_key().unwrap()),
        client_key: Arc::new(fhe::key_gen::load_client_key().unwrap()),
        market_state: Arc::new(Mutex::new(marketState)),
    };

    let app = Router::new()
        .route("/create-seed", post(handlers::pred::create_seed_handler))
        .route("/create-position", post(handlers::pred::create_position_handler))
        .route("/get-market/:id", get(handlers::pred::get_market_handler))
        .with_state(state);

    println!("Server running on http://0.0.0.0:3000");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}