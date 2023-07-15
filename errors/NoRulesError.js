class NoRulesError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NoRulesError';
    this.statusCode = 403;
  }
}

module.exports = NoRulesError;
