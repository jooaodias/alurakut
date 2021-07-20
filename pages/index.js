import { useEffect, useState } from 'react';
import { Box } from '../src/components/Box';
import { MainGrid } from '../src/components/MainGrid';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from '../src/lib/alurakutCommons';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';

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

export default function Home(props) {
  const user = props.githubUser;
  const [comunidades, setComunidades] = useState();
  const pessoasFavs = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'felipefialho',
  ];

  const [seguidores, setSeguidores] = useState([]);

  useEffect(() => {
    //Cathing followers
    fetch('https://api.github.com/users/jooaodias/followers')
      .then(response => {
        return response.json();
      })
      .then(data => {
        setSeguidores(data);
        console.log(data);
      });

    // API Graphql
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        Authorization: '41052c30ad3bcfef11750e5b06cb1f',
        'Content-Type': 'aplication/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: `query { 
          allCommunities { 
            title  
            id
            imageUrl
            creatorSlug
          } 
        }`,
      }),
    })
      .then(response => response.json())
      .then(data => {
        const comunidadesData = data.data.allCommunities;
        setComunidades(comunidadesData);
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
                  title: dadosForm.get('title'),
                  imageUrl: dadosForm.get('image'),
                  creatorSlug: user,
                };

                fetch('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(comunidade),
                }).then(async res => {
                  const dados = await res.json();
                  const comunidade = dados.record;
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas);
                });
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
            <h2 className="smalltitle">Comunidades ({comunidades?.length})</h2>
            <ul>
              {comunidades?.map((comunidade, i) => {
                return (
                  <li key={`${comunidade.key}__${i}`}>
                    <a href={`/comunities/${comunidade.id}`}>
                      <img src={comunidade.imageUrl} />
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

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;

  const { isAuthenticated } = await fetch(
    'https://alurakut.vercel.app/api/auth',
    {
      headers: {
        Authorization: token,
      },
    }
  ).then(res => res.json());

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  const { githubUser } = jwt.decode(token);

  return {
    props: {
      githubUser,
    }, // will be passed to the page component as props
  };
}
