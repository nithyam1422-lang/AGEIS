# 🛡️ AEGIS-X – AI-Powered Adaptive Incident Response System

AEGIS-X is an AI-powered Incident Response Agent that uses persistent Hindsight memory to detect, investigate, learn from, and simulate the repair of cybersecurity threats in a visual 3D security environment.

Unlike conventional security assistants, AEGIS-X remembers previous incidents, root causes, successful remediation strategies, runbooks, and post-mortems to continuously improve future incident response.

🚀 Live Features

🔍 AI-Powered Threat Detection & Investigation

🧠 Persistent Hindsight Memory for Historical Incidents

🕸️ 3D Security Operations Center Visualization

⚠️ Real-Time Threat Identification & Incident Monitoring

🔬 AI-Based Root Cause Analysis

💡 Explainable AI-Powered Repair Recommendations

🛠️ Visual Threat Repair & Remediation Simulation

👨‍💻 Human-in-the-Loop Repair Approval

🔄 Adaptive Runbooks Based on Previous Incidents

📝 Automated Post-Mortem & Learning

📊 Incident Response & Security Analytics

🔐 Secure and Auditable Response Workflow

🧠 How It Works User Flow

Security Threat Detected
↓
AI Incident Investigation
↓
Historical Incidents Retrieved from Hindsight Memory
↓
Root Cause Analysis
↓
AI Generates Repair Plan
↓
Human Approval
↓
3D Threat Repair Simulation
↓
System Verification
↓
Post-Mortem Generated
↓
Knowledge Stored in Hindsight
↓
Smarter Future Incident Response

🛠 Tech Stack

Frontend: React, Vite, TypeScript, Tailwind CSS

3D Visualization: Three.js / React Three Fiber

Backend: FastAPI

AI: LLM-based AI Agents

Memory: Hindsight by Vectorize

Charts & Analytics: Recharts

Animations: Framer Motion

🔐 Security Approach

AEGIS-X follows a human-in-the-loop approach for threat remediation.

AI analyzes the incident and recommends a repair strategy, while the analyst reviews and approves the action before the simulated repair is executed.

All threat-repair actions in the prototype are simulated for demonstration and safety.

📂 Project Structure

AEGIS-X/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── 3d/
│   └── services/
│
├── backend/
│   ├── agents/
│   ├── api/
│   ├── models/
│   └── services/
│
├── data/
│   ├── incidents/
│   ├── runbooks/
│   └── postmortems/
│
└── README.md

⚙️ Setup Guide

1️⃣ Clone Repository

git clone https://github.com/<your-username>/AEGIS-X.git
cd AEGIS-X

2️⃣ Backend Setup

cd backend
pip install -r requirements.txt

Create `.env` inside backend:

HINDSIGHT_API_KEY=your_key
LLM_API_KEY=your_key
JWT_SECRET=your_secret

Run backend:

uvicorn main:app --reload

Runs at:

http://127.0.0.1:8000

3️⃣ Frontend Setup

cd frontend
npm install
npm run dev

Runs at:

http://localhost:5173

🧩 Troubleshooting

Ensure the Hindsight API configuration is valid.

Verify the LLM API key is configured correctly.

Check backend logs if the AI investigation does not respond.

Ensure the frontend can connect to the backend.

For the 3D visualization, use a browser with WebGL support.
