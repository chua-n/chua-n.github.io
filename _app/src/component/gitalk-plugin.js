import Gitalk from 'gitalk';

const gitalk = new Gitalk({
  clientID: '0677de831ba15682dc35',
  clientSecret: '25da21a4bba522e21f21c0ddbf0de748336aa086',
  repo: 'notebook',
  owner: 'chua-n',
  admin: ['chua-n'],
  id: location.pathname,
  distractionFreeMode: false
});

export default function install(hook) {
  const dom = Docsify.dom;

  hook.mounted(function (_) {
    const div = dom.create('div');
    div.id = 'gitalk-container';
    const main = dom.getNode('#main');
    div.style = 'width: ' + (main.clientWidth) + 'px; margin: 0 auto 20px;';
    dom.appendTo(dom.find('.content'), div);
  });

  hook.doneEach(function (_) {
    const el = document.getElementById('gitalk-container');
    while (el.hasChildNodes()) {
      el.removeChild(el.firstChild);
    }

    // eslint-disable-next-line
    gitalk.render('gitalk-container');
  });
}
