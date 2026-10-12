const { Component, Fragment } = require('inferno');
const Article = require('./common/article');
const { Text, Category, Filter, Pagination } = require('./common/brand');
const { array } = require('../lib/content.cjs');
module.exports = class extends Component {
  render() {
    const { page, helper, config } = this.props;
    return <Fragment><div class="list-heading"><h1 class="list-title">{page.category ? <Category name={page.category}/> : page.tag ? '#'+page.tag : page.archive ? <Fragment><Text k="archives"/>{page.year ? ` / ${page.year}${page.month ? '-' + String(page.month).padStart(2,'0') : ''}` : ''}</Fragment> : <Text k="latest"/>}</h1><Filter page={page} helper={helper}/></div>
      {array(page.posts).length ? array(page.posts).map(p => <Article page={p} helper={helper} config={config} index={true}/>) : <div class="card empty-state"><Text k="filterEmpty"/></div>}
      <Pagination page={page} helper={helper}/>
    </Fragment>;
  }
};
