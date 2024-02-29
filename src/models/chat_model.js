class Chat {
  constructor(name, message, eventType = 'typing') {
    this.name = name;
    this.message = message;
    this.eventType = eventType;
  }

  // Method to convert object to JSON
  toJSON() {
    return JSON.stringify({
      name: this.name,
      message: this.message,
      eventType: this.eventType
    });
  }

  // Static method to create object from JSON string
  static fromJSON(jsonString) {
    const { name, message, eventType } = JSON.parse(jsonString);
    return new Chats(name, message, eventType);
  }
}