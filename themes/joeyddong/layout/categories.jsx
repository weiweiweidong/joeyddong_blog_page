const { Component } = require('inferno');
const { Text, Category } = require('./common/brand');
const { array } = require('../lib/content.cjs');
module.exports = class extends Component { render() { const {site,helper}=this.props; return <section class="card taxonomy-card"><div class="card-content"><Text k="categories" tag="h1" class="list-title"/><div class="taxonomy-grid">{array(site.categories).map(c => <a href={helper.url_for(c.path)}><Category name={c.name}/><span>{c.posts.length} <Text k="posts"/></span><span aria-hidden="true">↗</span></a>)}</div></div></section>; } };
