const { Component, Fragment } = require('inferno');
const { Text, Filter, Pagination } = require('./common/brand');
const { archiveGroups, day, articleLanguage } = require('../lib/content.cjs');
module.exports = class extends Component {
  render() {
    const { page, helper } = this.props;
    const groups = archiveGroups(page.posts);
    return <Fragment>
      <div class="list-heading">
        <h1 class="list-title"><Text k="archives"/>{page.year ? ` / ${page.year}${page.month ? '-' + String(page.month).padStart(2, '0') : ''}` : ''}</h1>
        <Filter page={page} helper={helper}/>
      </div>
      {groups.length ? <div class="card archive-card"><div class="card-content archive-timeline">
        {groups.map(({ year, posts }) => <section class="archive-year-group" aria-labelledby={'archive-year-' + year}>
          <h2 class="archive-year" id={'archive-year-' + year}>{year}</h2>
          <ul class="archive-posts">
            {posts.map(post => <li class="archive-entry">
              <span class="archive-dot" aria-hidden="true"/>
              <time dateTime={day(post.date)}>{day(post.date).slice(5)}</time>
              <a href={helper.url_for(post.path)} lang={articleLanguage(post)}>{post.title}</a>
            </li>)}
          </ul>
        </section>)}
      </div></div> : <div class="card empty-state"><Text k="filterEmpty"/></div>}
      <Pagination page={page} helper={helper}/>
    </Fragment>;
  }
};
