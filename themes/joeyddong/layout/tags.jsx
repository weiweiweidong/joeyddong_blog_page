const { Component, Fragment } = require('inferno');
const { Text } = require('./common/brand');
const { array } = require('../lib/content.cjs');
module.exports = class extends Component { render() { const {site,helper}=this.props; return <Fragment><div class="list-heading"><Text k="tags" tag="h1" class="list-title"/></div><section class="card taxonomy-card"><div class="card-content"><div class="tag-cloud tag-cloud-large">{array(site.tags).map(t => <a href={helper.url_for(t.path)}>#{t.name}<small>{t.posts.length}</small></a>)}</div></div></section></Fragment>; } };
