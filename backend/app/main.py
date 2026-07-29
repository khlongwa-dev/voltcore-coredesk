from  fastapi import FastAPI

app = FastAPI(
	title="Coredesk",
	description="IT helpdesk for Voltcore Engineering Solutions",
	version="1.0.0"
)

@app.get("/health")
def health_check():
	return {"status": "ok", "app": "Coredesk"}
