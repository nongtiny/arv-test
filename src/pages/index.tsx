import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState, } from "react"
import { SwitchTransition, CSSTransition  } from 'react-transition-group';
import Lenis from '@studio-freight/lenis'
import { debounce } from 'lodash';
import { useDebounce } from '../hooks/useDebounce'
import { UserService } from '../services/UserService';
import { TUserResponse, TUserResponseKey } from '../types/response';
import { STATUS_OK } from '../services/networkStatus';
import { CardUser } from '../components/CardUser';
import '../styles/page-index.css';

const ADD_SIZE = 5;
const SEARCH_KEYS = ['last_name', 'first_name', 'username'] as TUserResponseKey[];

export const IndexPage = () => {
  const lenisRef = useRef<Lenis>();
  const [users, setUsers] = useState([] as (TUserResponse | null)[]);
  const [inputSearch, setInputSearch] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedUserAddress, setSelectedUserAddress] = useState(null as TUserResponse | null);

  const loadingItemsOfAddSize = useMemo(() => Array.from({length: ADD_SIZE}, (_, i) => i + 1), []);
  const filteredUsers = useMemo(() => {
    if (inputSearch.length === 0) {
      return users;
    }
    return users.slice().filter((item) => item && SEARCH_KEYS.some((key) => item[key].toString().toLowerCase().includes(inputSearch.toLowerCase())))
  }, [users, inputSearch]);

  const fetchUsers = useCallback(async () => {
    try {
      let tmpUsersLoadings = loadingItemsOfAddSize.map((i) => {
        return null
      });
      setUsers(tmpUsersLoadings);
      const response = await UserService.getRandomUsers({
        size: ADD_SIZE
      })
      if (response.status === STATUS_OK && response.data) {
        setTimeout(() => {
          setUsers(response.data);
          sessionStorage.setItem('users', JSON.stringify(response.data));
        }, 200);
      }
    } catch (err) {
      console.log(err);
    }
  }, [loadingItemsOfAddSize]);

  useEffect(() => {
    sessionStorage.setItem('users', '[]')
    fetchUsers();
  }, [fetchUsers]);

  const debouncedAddMoreUsersHandler = debounce(fetchMoreUsers, 300);

  function initSmoothScroll(isMobile?: boolean) {

    const el = document.querySelector('.card-list') as HTMLElement;
    if (!el) {
      return;
    }
    if (isMobile) {
      lenisRef.current = new Lenis({});
    } else {
      lenisRef.current = new Lenis({
        wrapper: el,
        content: el
      });
    }
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
    setIsMobileOpen(true);
  }
  function handleOnMobileTrigger() {
    if (isMobileOpen) {
      handleOnMobileClose();
    } else {
      setIsMobileOpen(true);
    }
  }
  function handleOnMobileClose() {
    setIsMobileOpen(false);
    setSelectedUserAddress(null)
    if (filteredUsers.length === 0) {
      setInputSearch('');
    }
  }

  async function fetchMoreUsers(config?: {
    isMobile: boolean
  }) {
    try {
      let tmpUsersResults = users;
      let tmpUsersLoadings = loadingItemsOfAddSize.map((i) => {
        return null
      });
      setUsers([
        ...tmpUsersResults,
        ...tmpUsersLoadings,
      ]);

      const response = await UserService.getRandomUsers({
        size: ADD_SIZE
      })
      if (response.status === STATUS_OK && response.data) {
        tmpUsersResults = [
          ...tmpUsersResults,
          ...response.data
        ];
        setUsers(tmpUsersResults);
        sessionStorage.setItem('users', JSON.stringify(tmpUsersResults));
        initSmoothScroll(config && config.isMobile);
        lenisRef.current?.scrollTo('bottom');
      }
    } catch (err) {
      console.log(err);
    }
  }
  return <div
    className={
      "grid grid-cols-1"
      + " md:grid-cols-2"
    }
  >
    <aside
      className={
        "fixed bottom-0 left-0 z-30 bg-white w-full"
        + (isMobileOpen ? " is-mobile-open" : "")
        + " md:relative md:bottom-initial md:flex md:col-span-1 md:border-r-4 md:border-black"
      }
    >
      <div
        className={
          "w-full h-[60px] grid grid-cols-2 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
          + " md:hidden"
        }
      >
        <button
          className="border-r-2"
          onClick={handleOnMobileTrigger}
        >
          { selectedUserAddress ? 'ADDRESS' : 'SEARCH' }
        </button>
        <button onClick={() => debouncedAddMoreUsersHandler({ isMobile: true })}>
          ADD MORE
        </button>
      </div>
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
              ? <div className="w-full h-full flex flex-col justify-between">
                <div className="mt-5 md:mt-0">
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
                <div
                  className={
                    "hidden base-container pb-6"
                    + " md:block"
                  }
                >
                  <button
                    className="base-btn"
                    onClick={() => setSelectedUserAddress(null)}
                  >
                    BACK
                  </button>
                </div>
              </div>
              : <div className="w-full h-full flex flex-col justify-between pt-10 pb-20">
                <div>
                  <label
                    htmlFor="searchInput"
                    className="w-full block text-center input-header-text font-bold"
                  >
                    INPUT
                  </label>
                  <div className="base-container text-center">
                    <input
                      id="searchInput"
                      value={inputSearch}
                      type="text"
                      placeholder="Type to search"
                      className="block w-full px-6 py-4 border-2 border-black text-center focus:outline"
                      onInput={handleOnInputSearch}
                    />
                    <button
                      className={
                        "text-xs underline transform-opacity duration-200 ease-in-out"
                        + (inputSearch.length > 0 ? ' opacity-100 visible' : ' opacity-0 invisible')
                      }
                      onClick={() => setInputSearch('')}
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div
                  className={
                    "hidden base-container"
                    + " md:block"
                  }
                >
                  <button
                    className="base-btn"
                    onClick={() => debouncedAddMoreUsersHandler()}
                  >
                    ADD MORE ROBOTS
                  </button>
                </div>
              </div>
          }
        </CSSTransition>
      </SwitchTransition>
      <button
        className={
          "absolute z-20 bottom-4 left-1/2 transform -translate-x-1/2 underline"
          + " md:hidden"
        }
        onClick={handleOnMobileClose}
      >
        Close
      </button>
    </aside>

    <div
      className={
        "block"
        + " md:col-span-1"
      }
    >
      <div className="card-list-wrapper w-full">
        {
          inputSearch.length && filteredUsers.length === 0
            ? <div className="relative base-container p-20 text-center">
              NO DATA 🥺
            </div>
            : <></>
        }
        <ul
          className={
            "card-list"
            + " md:h-vh md:overflow-auto"
          }
        >
          {
            filteredUsers.map((user, index) =>
              user
                ? <li
                  key={`${user.id}${index}`}
                  className={
                    "group-card cursor-pointer border-b-4 border-black last:border-b-0"
                    + (selectedUserAddress && selectedUserAddress.id === user.id ? ' selected-address' : '')
                  }
                >
                  <CardUser
                    user={user}
                    onSelectAddress={onSelectUserAddress}
                  />
                </li>
                : <li
                  key={`nullLoading${index}`}
                  className="group-card cursor-pointer border-b-4 border-black last:border-b-0"
                >
                  <CardUser user={user} />
                </li>
            )
          }
        </ul>
      </div>
    </div>
  </div>;
}