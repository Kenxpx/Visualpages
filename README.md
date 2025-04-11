# Vapi-AI-Automation

---

## ⚙️ Setup Instructions

### 1. 🔧 Airtable

- Create two tables: `Leads` and `Call Logs`
- Fields in `Leads`: First Name, Last Name, Mobile, Email, Status, Attempt, Date Time, Summary, Assignee
- Add sample leads with `Status = TBC`

### 2. 🎙️ Create Vapi Voice Agent

- Sign up at [https://vapi.ai](https://vapi.ai)
- Create a new agent named **Maya**
- Paste the prompt from `prompt/voice-agent-prompt.md`
- Save the **Assistant ID**
- Generate your **Private API Key**

### 3. 🔄 Set Up n8n Workflow

- Sign in at [https://app.n8n.cloud](https://app.n8n.cloud)
- Create a new workflow
- Add nodes:
  - Airtable → Search Records (`Status = TBC`)
  - HTTP Request → Call Vapi
- Method: `POST`
- URL: `https://api.vapi.ai/call`
- Headers:
  - `Authorization`: `Bearer YOUR_VAPI_API_KEY`
  - `Content-Type`: `application/json`
- Body (JSON):
```json
{
  "assistant_id": "your-assistant-id",
  "phone_number": "+91{{$json['Mobile']}}",
  "custom_data": {
    "first_name": "{{$json['First Name']}}",
    "lead_id": "{{$json['id']}}"
  }
}
