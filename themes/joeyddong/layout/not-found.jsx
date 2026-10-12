const { Component } = require('inferno');
const { Text } = require('./common/brand');
module.exports = class extends Component { render() { return <section class="card"><div class="card-content"><p class="eyebrow">404</p><Text k="notFound" tag="h1" class="list-title"/><a class="back-link" href="/"><Text k="homeBack"/> ←</a></div></section>; } };
