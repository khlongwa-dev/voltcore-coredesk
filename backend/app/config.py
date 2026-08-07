from pydantic_settings import BaseSettings

class Settings(BaseSettings):
	DATABASE_URL: str
	SECRET_KEY: str
	ALGORITHM: str
	ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
	DEFAULT_TEMP_PASSWORD: str = "Voltcore@2026!"
	NTFY_BASE_URL: str = "https://ntfy.sh"
	NTFY_TOPIC_PREFIX: str = "coredesk-user"

	class Config:
		env_file = ".env"

settings = Settings()
