const { Component, Fragment } = require('inferno');
const { Text, Meta, Terms } = require('./brand');
const { excerpt, articleLanguage } = require('../../lib/content.cjs');
module.exports = class extends Component {
  render() {
    const { page, helper, index } = this.props;
    const url = helper.url_for;
    return <article class={'card article-card ' + (index ? 'article-preview' : 'article-full')} lang={articleLanguage(page)}>
      {page.cover ? (index ? <a class="article-cover" href={url(page.path)} tabIndex="-1" aria-hidden="true"><img src={url(page.cover)} alt="" loading="lazy" width="1200" height="560"/></a> : <div class="article-cover"><img src={url(page.cover)} alt={page.cover_alt || ''} width="1200" height="560"/></div>) : null}
      <div class="card-content"><Meta post={page}/>
        {index ? <h2 class="article-title"><a href={url(page.path)}>{page.title}</a></h2> : <h1 class="article-title">{page.title}</h1>}
        {index ? <Fragment><p class="article-summary">{excerpt(page)}</p><Terms post={page} helper={helper}/><a class="read-more" href={url(page.path)}><Text k="readMore"/><span class="circle-arrow" aria-hidden="true">↗</span></a></Fragment> : <Fragment>
          {page.test ? <Text k="testNotice" tag="p" class="test-notice"/> : null}
          <div class="content article-content" dangerouslySetInnerHTML={{__html:page.content}}/>
          <Terms post={page} helper={helper}/>
          <nav class="post-navigation" aria-label="Article navigation">
            {page.prev ? <a href={url(page.prev.path)}><Text k="previous" tag="span"/><strong>{page.prev.title}</strong></a> : null}
            {page.next ? <a href={url(page.next.path)}><Text k="next" tag="span"/><strong>{page.next.title}</strong></a> : null}
          </nav><a class="back-link" href={url('/')}><Text k="back"/> ←</a>
        </Fragment>}
      </div>
    </article>;
  }
};
