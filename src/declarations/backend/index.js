// Auto-generated actor factory for the backend canister.
// This file is resolved by the Vite "declarations" alias (src/declarations/).
import { Actor, HttpAgent } from "@icp-sdk/core/agent";
import { idlFactory } from "../../frontend/src/declarations/backend.did.js";
import envJson from "../../frontend/env.json";

export const canisterId = envJson.backend_canister_id;

export function createActor(canisterId, options = {}) {
  const agent = options.agent || new HttpAgent({ ...options.agentOptions });
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
}
