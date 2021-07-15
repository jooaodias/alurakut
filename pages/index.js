import { useEffect, useState } from 'react';
import { Box } from '../src/components/Box';
import { MainGrid } from '../src/components/MainGrid';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from '../src/lib/alurakutCommons';

function ProfileSideBar(props) {
  return (
    <Box>
      <img
        src={`https://github.com/${props.githubUser}.png`}
        style={{ borderRadius: '8px' }}
      />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox({ title, items }) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smalltitle">
        {title} ({items.length})
      </h2>
      <ul>
        {items.map((items, i) => {
          return (
            <li key={`${items.id}__${i}`}>
              <a href={`https://github.com/${items.login}.png`}>
                <img src={items.avatar_url} />
                <span>{items.login}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home() {
  const user = 'jooaodias';
  const [comunidades, setComunidades] = useState([
    {
      id: '123123534534515',
      titulo: 'AluraKut',
      image: 'https://placehold.it/300x300',
    },
  ]);
  const pessoasFavs = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'felipefialho',
  ];

  const [seguidores, setSeguidores] = useState([]);

  useEffect(() => {
    fetch('https://api.github.com/users/jooaodias/followers')
      .then(response => {
        return response.json();
      })
      .then(data => {
        setSeguidores(data);
        console.log(data);
      });
  }, []);
  return (
    <>
      <AlurakutMenu githubUser={user} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar githubUser={user} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                const dadosForm = new FormData(e.target);

                const comunidade = {
                  id: new Date().toISOString(),
                  title: dadosForm.get('title'),
                  image: dadosForm.get('image'),
                };
                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades(comunidadesAtualizadas);
              }}
            >
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>
              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: 'profileRelationsArea' }}
        >
          <ProfileRelationsBox title={'Seguidores'} items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smalltitle">Comunidades ({comunidades.length})</h2>
            <ul>
              {comunidades.map((comunidade, i) => {
                return (
                  <li key={`${comunidade.key}__${i}`}>
                    <a href={`/users/${comunidade.title}`}>
                      <img src={comunidade.image} />
                      <span>{comunidade.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smalltitle">
              Pessoas da comunidade ({pessoasFavs.length})
            </h2>
            <ul>
              {pessoasFavs.map((pessoa, i) => {
                return (
                  <li key={`${pessoa}+${i}`}>
                    <a href={`/users/${pessoa}`}>
                      <img src={`https://github.com/${pessoa}.png`} />
                      <span>{pessoa}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}
