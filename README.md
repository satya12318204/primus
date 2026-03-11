# Primus Local Distributed Platform

Primus is a decentralized, peer-to-peer compute platform designed to securely distribute ML tasks and general workloads across machines on a local network.

This repository contains the completely functional Phase 5 build of the MVP, featuring an Express Node.js backend acting as a network discovery registry, and a React + Vite frontend that enables real-time distributed cluster topology mappings.

## Architecture
The system consists of two tightly coupled environments:
- **`mvp-backend`**: Core Express server handling Node Discovery and real-time hardware status metrics using `systeminformation`.
- **`mvp-frontend`**: React frontend showcasing modern glassmorphism UI, a dashboard executing real-time simulated metric aggregation, and network topology visualization.

## Prerequisites
- **Node.js**: v18 or later.
- **Git**

## Setup and Installation

### 1. Start the Backend Registry
The backend must run first as it acts as the central local node registry for all sub-devices.
```bash
cd mvp-backend
npm install
npm run dev
```
*(Runs on `http://localhost:3000`)*

### 2. Start the Frontend Application
In a separate terminal, launch the React interface.
```bash
cd mvp-frontend
npm install
npm run dev
```
*(Runs on `http://localhost:5173` and binds to `host: true` to allow subnet connections)*

## How to use the Distributed Cluster Mode

This application simulates a secure decentralized pipeline. You can use multiple devices (like a laptop and a phone) to test the multi-node scaling:

1. **Connect Contributors**:
   - Open the web application (`http://localhost:5173`) on your **Computer** and navigate to the **Contributor** portal.
   - Find your computer's local Wi-Fi IP address (e.g. `192.168.1.X`), open Safari/Chrome on your **Mobile Phone** on the same Wi-Fi, and go to `http://192.168.1.X:5173`. Select Contributor.
   - *Both devices will automatically parse their hardware specs and register as Active Nodes to the backend.*

2. **Request Batch Compute**:
   - Open a third tab on your computer and navigate to the **Requester** portal.
   - The Network Discovery scanner will dynamically locate both your Desktop and your Mobile device.
   - Use the checkboxes to select **both nodes**.
   - Click **Request Access from 2 Nodes**.

3. **Secure Approval Pipeline**:
   - Tap "Approve Request & Host Sandbox" on your Mobile device screen.
   - Click "Approve Request & Host Sandbox" on your Desktop contributor screen.
   - Your Requester window will track that both specific node IDs have granted sandbox access.

4. **Distributed Execution Dashboard**:
   - Once both nodes approve, upload a dummy `.py` file to the UI.
   - Click **Deploy Sandbox & Open Grafana Dashboard**.
   - The system will read the approved array of nodes and dynamically generate a **Distributed Cluster Matrix**.
   - You will see live process tracking, individual hardware gauges scaling up for each node, and simulated log outputs tracking the parallelized AI training!

5. **Retrieve Output**:
   - When execution finishes, click **Download Sandbox Output Securely**.
   - The backend will package a `.txt` file proving the cluster mapping execution and secure file hand-offs!

## Built With
- **Frontend Core**: React, Vite
- **Styling**: Vanilla CSS, Lucide Icons, Custom Glassmorphism System
- **Backend Edge**: Express.js, SystemInformation (Real hardware metrics)
