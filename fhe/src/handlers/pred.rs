use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use axum::{Json, extract::{State, Path}, http::StatusCode};
use tfhe::{FheUint8, FheUint16, ServerKey, set_server_key, ClientKey};
use tfhe::prelude::*;

#[derive(Clone)]
pub struct MarketState {
    id_counter: u128,
    market: HashMap<u128, Seed>,
}

#[derive(Clone)]
pub struct Seed {
    pub id: u128,
    pub positions: Vec<Position>
}

#[derive(Clone)]
pub struct Position {
    pub owner: String,
    pub weight: FheUint8,
    pub bet: FheUint8
}

impl MarketState{

    // pub fn new() -> Self {
    //     Self {

    //     }
    // }

}