// import React from 'react';
import './App.scss';
import { useState } from 'react';
import cn from 'classnames';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

const photos = photosFromServer.map((photo) => {
  const albums = albumsFromServer.find(album => (
    photo.albumId === album.id
  ));

  const user = usersFromServer.find(currentUser => (
    currentUser.id === albums.userId
  ));

  return {
    ...photo,
    albums,
    user,
  };
});

const filterPhotos = (selectedUser, selectedAlbum, searchQuery) => {
  let allPhotos = [...photos];

  if (selectedUser) {
    if (selectedUser === 'all') {
      allPhotos = [...photos];
    } else {
      allPhotos = allPhotos.filter(photo => photo.user.name === selectedUser);
    }
  }

  if (searchQuery) {
    allPhotos = allPhotos.filter(photo => (
      photo.title.toLowerCase().includes(searchQuery)
    ));
  }

  if (selectedAlbum.length) {
    allPhotos = allPhotos.filter(photo => (
      selectedAlbum.includes(photo.albums.title)
    ));
  }

  return allPhotos;
};

export const App = () => {
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedAlbum, setSelectedAlbum] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const allPictures = filterPhotos(selectedUser, selectedAlbum, searchQuery);

  const resetAllFilters = () => {
    setSelectedUser('all');
    setSelectedAlbum([]);
    setSearchQuery('');
  };

  const checkSelectedAlbum = (title) => {
    if (selectedAlbum.includes(title)) {
      setSelectedAlbum(selectedAlbum.filter(album => (
        album.title === title
      )));
    } else {
      setSelectedAlbum([...selectedAlbum, title]);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Photos from albums</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                onClick={() => setSelectedUser('all')}
                className={cn({ 'is-active': selectedUser === 'all' })}
                href="#/"
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  onClick={() => setSelectedUser(user.name)}
                  className={cn({ 'is-active': selectedUser === user.name })}
                  key={user.id}
                  href="#/"
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchQuery && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      onClick={() => setSearchQuery('')}
                      type="button"
                      className="delete"
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                onClick={() => setSelectedAlbum([])}
                href="#/"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {albumsFromServer.map(album => (
                <a
                  onClick={() => checkSelectedAlbum(album.title)}
                  key={album.id}
                  className="button mr-2 my-1 is-info"
                  href="#/"
                >
                  {album.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                onClick={resetAllFilters}
                href="#/"
                className="button is-link is-outlined is-fullwidth"

              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {allPictures.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No photos matching selected criteria
            </p>
          ) : (
            <table
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Photo name

                      <a href="#/">
                        <span className="icon">
                          <i className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Album name

                      <a href="#/">
                        <span className="icon">
                          <i className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User name

                      <a href="#/">
                        <span className="icon">
                          <i className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {allPictures.map(photo => (
                  <tr>
                    <td className="has-text-weight-bold">
                      {photo.id}
                    </td>

                    <td>{photo.title}</td>
                    <td>{photo.albums.title}</td>

                    <td className={photo.user.sex === 'm'
                      ? 'has-text-link'
                      : 'has-text-danger'}
                    >
                      {photo.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
