# Telegram Alert Bot

This project is a Telegram Bot API that sends alert notifications to its users.
It is designed to receive alert messages from a REST client and forward them to subscribed Telegram users.

## Features

- Receives alert notifications from a REST client.
- Forwards alerts to registered Telegram users based on alert subject.
- Simple and easy to integrate with monitoring or alerting systems.

## Usage

1. **Clone the repository:**
    ```bash
    git clone https://github.com/elbek69114/telegram-alert-bot.git
    cd telegram-alert-bot
    ```

2. **Configure the bot:**
    - Set your Telegram Bot Token and other configuration in the environment or config file.
    - For subject-based subscriptions, set environment variables like:
      ```
      SUBJECT_USER_SERVICE=[subscriber-chat-id]
      ```
      This will send alerts with `subject: user-service` to the specified chat ID.

3. **Run the bot:**
    ```bash
    deno run --allow-net --allow-env main.ts
    ```

4. **Send alerts:**
    - Use your REST client to POST alert messages to the bot's API endpoint.

## API

- **POST /alert**
  - **Body:** `{ "subject": "user-service", "message": "NotFoundException: user not found by login: xyz" }`
  - **Description:** Sends an alert to all registered users subscribed to the given subject.

## License

MIT
