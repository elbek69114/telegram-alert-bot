# Telegram Alert Bot

## About
The Telegram Alert Bot is a lightweight application designed to notify developers in real-time when exceptions or errors occur in their codebase. It integrates with a REST API to receive alert messages and forwards them to a specified Telegram chat configured via environment variables. Built with Deno, this bot is actively used in production with Netlify integration for seamless deployment. Developers can fork the repository and use it as needed. The bot includes a security feature requiring a secret token in POST requests to ensure authorized access.

## Features
- **Real-time Notifications**: Sends instant alerts to a Telegram chat when exceptions occur.
- **REST API Integration**: Accepts POST requests to the `/alert` endpoint to trigger notifications.
- **Environment-based Configuration**: Uses environment variables to specify the Telegram API URL, API key, chat ID, and secret token.
- **Dynamic Chat Support**: Allows specifying a custom chat ID in the request body for flexible alert routing.
- **Security**: Requires a `PRODUCER_SECRET_TOKEN` in the `X-Producer-Secret-Token` header for authorized API requests.
- **Production-ready**: Integrated with Netlify and actively running in a real-world environment.
- **Lightweight and Scalable**: Built with Deno for simplicity and performance.

## Prerequisites
Before setting up the bot, ensure you have the following:
- [Deno](https://deno.land/) installed (version 1.30 or higher recommended).
- A Telegram Bot Token (obtained from [BotFather](https://t.me/BotFather)).
- A Telegram chat ID where alerts will be sent (e.g., a group or channel ID).

## Local Setup
Follow these steps to run the bot locally on your computer:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/elbek69114/telegram-alert-bot.git
   cd telegram-alert-bot
   ```

2. **Generate a Secret Token**:
   Create a secure `PRODUCER_SECRET_TOKEN` for API authentication. You can generate a random token using Deno or any secure method. Example using Deno:
   ```bash
   deno run -A -q https://deno.land/std@0.177.0/crypto/random_uuid.ts
   ```
   This will output a UUID like `550e8400-e29b-41d4-a716-446655440000`. Alternatively, use a custom secure string (at least 32 characters recommended).

3. **Configure Environment Variables**:
   Create a `.env` file in the project root and add the following:
   ```bash
   TELEGRAM_API_URL=https://api.telegram.org
   TELEGRAM_API_KEY=bot<your_bot_token_here>
   CONSUMER_CHAT_ID=-100123456789
   PRODUCER_SECRET_TOKEN=your_generated_secret_token
   ```
   - Replace `https://api.telegram.org` with the Telegram API URL (typically `https://api.telegram.org`).
   - Replace `your_bot_token_here` with your Telegram Bot Token, prefixed with `bot` (e.g., `bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`).
   - Replace `-100123456789` with your Telegram chat ID.
   - Replace `your_generated_secret_token` with the token generated in step 2.

4. **Install Dependencies**:
   No additional dependencies are required as Deno handles imports directly.

5. **Run the Bot**:
   Start the bot using Deno with the necessary permissions:
   ```bash
   deno run --allow-net --allow-env main.ts
   ```
   The bot will start and listen for incoming POST requests to the `/alert` endpoint.

6. **Test the Bot**:
   Send a test alert using a REST client (e.g., cURL or Postman), including the `X-Producer-Secret-Token` header:
   ```bash
   curl -X POST http://localhost:8000/alert \
   -H "Content-Type: application/json" \
   -H "X-Producer-Secret-Token: your_generated_secret_token" \
   -d '{"subject": "user-service", "message": "NotFoundException: user not found by login: xyz"}'
   ```
   Replace `your_generated_secret_token` with the token from your `.env` file. The bot will forward the message to the configured Telegram chat if the token is valid.

## API
The bot exposes a single endpoint for sending alerts:

- **POST /alert**
  - **Headers**:
    ```bash
    X-Producer-Secret-Token: your_generated_secret_token
    ```
    The token must match the `PRODUCER_SECRET_TOKEN` set in the `.env` file.
  - **Body**:
    ```json
    {
      "subject": "user-service",
      "message": "NotFoundException: user not found by login: xyz",
      "chatId": "-100123456789" // Optional, overrides CONSUMER_CHAT_ID
    }
    ```
  - **Description**: Sends the specified message to the Telegram chat associated with the subject or the provided `chatId`. The request must include a valid `X-Producer-Secret-Token` header for authentication.

## Usage
This project is open for anyone to fork and use. Simply fork the repository on GitHub and set it up as described above to integrate it into your own environment. The bot is already running in production with Netlify integration, but you can adapt it for your own deployment needs.

## License
This project is licensed under the [MIT License](LICENSE).

## Contact
For questions or suggestions, open an issue on GitHub or contact the maintainer at [elbek69114@example.com].