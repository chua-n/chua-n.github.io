import Gitalk from 'gitalk';

const BASE_CONFIG = {
  clientID: '0677de831ba15682dc35',
  clientSecret: '25da21a4bba522e21f21c0ddbf0de748336aa086',
  repo: 'notebook',
  owner: 'chua-n',
  admin: ['chua-n'],
  labels: ['gitalk'],
  enableHotKey: true,
  // createIssueManually: true,
  distractionFreeMode: false,
};

function buildGitalkId() {
  const hash = decodeURI(location.hash);
  const beginIndex = hash.indexOf('#') + 1;
  const endIndex = hash.indexOf('?');
  const res = endIndex > -1 ? hash.substring(beginIndex, endIndex) : hash.substring(beginIndex);
  console.log('gitalk-id: ', res);
  return res;
}

export default function install(hook) {
  const dom = Docsify.dom;

  hook.mounted(() => {
    const div = dom.create('div');
    div.id = 'gitalk-container';
    const main = dom.getNode('#main');
    div.style = 'width: ' + (main.clientWidth) + 'px; margin: 0 auto 20px;';
    dom.appendTo(dom.find('.content'), div);
  });

  hook.doneEach(() => {
    const el = document.getElementById('gitalk-container');
    while (el.hasChildNodes()) {
      el.removeChild(el.firstChild);
    }

    const gitalk = new Gitalk({
      ...BASE_CONFIG,
      id: buildGitalkId(),
    });

    // eslint-disable-next-line
    gitalk.render('gitalk-container');
  });
}
