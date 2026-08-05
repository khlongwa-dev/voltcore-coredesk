from pydantic_settings import BaseSettings

class Settings(BaseSettings):
	DATABASE_URL: str
	SECRETE_KEY: str
	ALGORITHM: str
	ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
	DEFAULT_TEMP_PASSWORD: str = "Voltcore@2026!"

	class Config:
		env_file = ".env"

settings = Settings()
