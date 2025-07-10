# Telegram Alert Bot

This project is a Telegram Bot API that sends alert notifications to its users. It is designed to receive alert messages from a REST client and forward them to subscribed Telegram users.

## Features

- Receives alert notifications from a REST client.
- Forwards alerts to registered Telegram users.
- Simple and easy to integrate with monitoring or alerting systems.

## Usage

1. **Clone the repository:**
    ```bash
    git clone https://github.com/elbek69114/telegram-alert-bot.git
    cd telegram-alert-bot
    ```

2. **Configure the bot:**
    - Set your Telegram Bot Token and other configuration in the environment or config file.

3. **Run the bot:**
    ```bash
    deno run --allow-net --allow-env main.ts
    ```

4. **Send alerts:**
    - Use your REST client to POST alert messages to the bot's API endpoint.

## API

- **POST /alert**
  - **Body:** `{ "message": "Your alert message" }`
  - **Description:** Sends an alert to all registered users.

## License

MIT
