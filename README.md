# Telegram Alert Bot

This project is a Telegram Bot API that sends alert notifications to its users.
It is designed to receive alert messages from a REST client and forward them to subscribed Telegram users.

## Features

- Receives alert notifications via a REST API.
- Forwards alerts to Telegram users based on the alert subject.
- Easy integration with monitoring or alerting systems.
- Uses environment variables for subject-based subscriptions.

## Usage

1. **Clone the repository:**
    ```bash
    git clone https://github.com/elbek69114/telegram-alert-bot.git
    cd telegram-alert-bot
    ```

2. **Configure the bot:**
    - Set your Telegram Bot Token and other configuration in the environment or config file.
    - Set environment variables in the following format:
      ```
      CONSUMER_CHAT_ID=-100123456789
      ```
      You can add dynamic chant by using request body: `chatId: your spesific chantId`

3. **Run the bot:**
    ```bash
    deno run --allow-net --allow-env main.ts
    ```

4. **Send alerts:**
    - Use your REST client to POST alert messages to the bot's API endpoint.
    - Example request:
      ```http
      POST /alert
      Content-Type: application/json

      {
        "subject": "user-service",
        "message": "NotFoundException: user not found by login: xyz"
      }
      ```

## API

- **POST /alert**
  - **Body:**  
    ```json
    {
      "subject": "user-service",
      "message": "NotFoundException: user not found by login: xyz"
    }
    ```
  - **Description:** Sends an alert to all registered users subscribed to the given subject.

## License

MIT
