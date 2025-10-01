use axum::{
    routing::{get, post}, Router, extract::State,
    http::{HeaderMap, Method, Request, Response, StatusCode},
    middleware::{self, Next},
    response::IntoResponse,
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

#[derive(Clone)]
struct AppState {
    server_key: Arc<ServerKey>,
    client_key: Arc<ClientKey>,
}

#[tokio::main]
async fn main() {

    if let Err(e) = fhe::key_gen::generate_and_save_keys() {
        eprintln!("Failed to generate keys: {}", e);
        return;
    }

    let app = Router::new();

    
    println!("Server running on http://0.0.0.0:3000");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}