const { Component } = require('inferno');
module.exports = class extends Component { render() { const {page}=this.props; return <section class="card"><div class="card-content"><h1 class="list-title">{page.title}</h1><div class="content" dangerouslySetInnerHTML={{__html:page.content || ''}}/></div></section>; } };
