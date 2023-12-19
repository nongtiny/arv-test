import { ChangeEvent, useEffect, useMemo, useRef, useState, } from "react"
import { SwitchTransition, CSSTransition  } from 'react-transition-group';
import Lenis from '@studio-freight/lenis'

import { UserService } from '../services/UserService';
import { TUserResponse, TUserResponseKey } from '../types/response';
import { STATUS_OK } from '../services/networkStatus';
import { CardUser } from '../components/CardUser';

const ADD_SIZE = 5;
const searchKeys = ['last_name', 'first_name', 'username'] as TUserResponseKey[];

export const IndexPage = () => {
  const lenisRef = useRef<Lenis>();
  const [users, setUsers] = useState([] as TUserResponse[]);
  const [isLoadingUserInit, setIsLoadingUserInit] = useState(false);
  const [inputSearch, setInputSearch] = useState('');
  const [selectedUserAddress, setSelectedUserAddress] = useState(null as TUserResponse | null);
  const searchNodeRef = useRef(null);
  const addressNodeRef = useRef(null);

  const nodeRef = useMemo(() => selectedUserAddress ? addressNodeRef : searchNodeRef ,[selectedUserAddress]);

  const loadingItemsOfAddSize = useMemo(() => Array.from({length: ADD_SIZE}, (_, i) => i + 1), []);

  const filteredUsers = useMemo(() => {
    if (inputSearch.length === 0) {
      return users;
    }
    return users.slice().filter((item) => searchKeys.some((key) => item[key].toString().toLowerCase().includes(inputSearch.toLowerCase())))
  }, [users, inputSearch]);

  useEffect(() => {
    fetchUsers();
  }, []);

  function initSmoothScroll() {
    const el = document.querySelector('.card-list') as HTMLElement;
    if (!el) {
      return;
    }
    lenisRef.current = new Lenis({
      wrapper: el,
      content: el
    });
    function raf(time: any) {
      if (lenisRef.current) {
        lenisRef.current.raf(time);
        requestAnimationFrame(raf);
      }
    }
    requestAnimationFrame(raf);
  }
  function handleOnInputSearch(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setInputSearch(value);
  }
  function onSelectUserAddress(user: TUserResponse) {
    setSelectedUserAddress(user);
  }
  async function fetchUsers() {
    setIsLoadingUserInit(true)
    try {
      const response = await UserService.getRandomUsers({
        size: ADD_SIZE
      })
      if (response.status === STATUS_OK && response.data) {
        setIsLoadingUserInit(false)
        setTimeout(() => {
          setUsers(response.data);
        }, 200);
      }
    } catch {
      setIsLoadingUserInit(false)
    }
  }
  async function fetchMoreUsers() {
    setIsLoadingUserInit(true)
    try {
      let tmpUsersResults = users;
      const response = await UserService.getRandomUsers({
        size: ADD_SIZE
      })
      if (response.status === STATUS_OK && response.data) {
        tmpUsersResults = [
          ...tmpUsersResults,
          ...response.data
        ];
        setUsers(tmpUsersResults);
        initSmoothScroll();
        lenisRef.current?.scrollTo('bottom');
        setTimeout(() => {
          setIsLoadingUserInit(false)
        });
      }
    } catch {
      setIsLoadingUserInit(false)
    }
  }
  return <div
    className={
      "grid grid-cols-1"
      + " md:grid-cols-3"
      + " lg:grid-cols-2"
    }
  >
    <aside
      className={
        "fixed"
        + " md:relative md:flex md:col-span-1 md:border-r-4 md:border-black"
      }
    >
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={selectedUserAddress ? selectedUserAddress.id : 'INPUTREFKEY'}
          addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
          classNames='fade-address-input'
          unmountOnExit
          mountOnEnter
        >
          {
            selectedUserAddress
              ? <div className="w-full flex flex-col justify-between">
                <div>
                  <label
                    htmlFor="searchInput"
                    className="w-full block text-center input-header-text font-bold"
                  >
                    ADDRESS
                  </label>
                  <div className="base-container">
                    <div className="flex">
                      <span className="mr-5">📫</span>
                      <span>
                        { selectedUserAddress.address.street_address } { selectedUserAddress.address.street_name }
                        <br />
                        { selectedUserAddress.address.city } { selectedUserAddress.address.country }
                        <br />
                        { selectedUserAddress.address.zip_code }
                      </span>
                    </div>
                    <div className="flex mt-5">
                      <span className="mr-5">🌐</span>
                      <span>
                        <a
                          href={'https://maps.google.com/?q='+selectedUserAddress.address.coordinates.lat+','+selectedUserAddress.address.coordinates.lng}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          Google Map Link
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="base-container pb-4">
                  <button
                    className="base-btn"
                    onClick={() => setSelectedUserAddress(null)}
                  >
                    BACK
                  </button>
                </div>
              </div>
              : <div className="w-full flex flex-col justify-between">
                <div>
                  <label
                    htmlFor="searchInput"
                    className="w-full block text-center input-header-text font-bold"
                  >
                    INPUT
                  </label>
                  <div className="base-container">
                    <input
                      id="searchInput"
                      value={inputSearch}
                      type="text"
                      placeholder="Type to search"
                      className="block w-full px-6 py-4 border-2 border-black text-center focus:outline"
                      onInput={handleOnInputSearch}
                    />
                  </div>
                </div>
                <div className="base-container pb-4">
                  <button
                    className="base-btn"
                    onClick={fetchMoreUsers}
                  >
                    ADD MORE ROBOTS
                  </button>
                </div>
              </div>
          }
        </CSSTransition>
      </SwitchTransition>
    </aside>
    <div
      className={
        "block"
        + " md:col-span-2"
        + " lg:col-span-1"
      }
    >
      <div className="card-list-wrapper w-full">
        <ul className="card-list h-vh overflow-auto">
          {
            filteredUsers.map((user, index) =>
              <li
                key={`${user.id}${index}`}
                className={
                  "group-card border-b-4 border-black cursor-pointer"
                  + (selectedUserAddress && selectedUserAddress.id === user.id ? ' selected-address' : '')
                }
              >
                <CardUser
                  user={user}
                  onSelectAddress={onSelectUserAddress}
                />
              </li>
            )
          }
          {
            isLoadingUserInit
              ? loadingItemsOfAddSize.map((index) =>
                <li
                  key={`loadingUserCard${index}`}
                  className="border-b-4 border-black"
                >
                  <CardUser user={null} />
                </li>
              )
              : <></>
          }
        </ul>
      </div>
    </div>
  </div>;
}