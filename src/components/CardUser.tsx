import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition  } from 'react-transition-group';
import { ICardUser } from '../types/cardUser';
import '../styles/card-user.css';

export const CardUser = ({ user, onSelectAddress }: ICardUser) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  return <div className="relative base-container min-h-[129px] !overflow-hidden">
    {
      user && isImageLoaded && onSelectAddress
        ? <div className="avatar-image-hidden__wrapper z-20">
          <img
            src={user.avatar}
            alt={user.username}
            className="avatar-image-hidden w-auto h-20 object-contain"
          />
          <div className="action-list absolute top-[-30px] left-[-100px] flex flex-col items-start gap-1 z-10">
            <button
              className="group p-1 text-[#3155FF]"
              onClick={() => onSelectAddress(user)}
            >
              🏠 <span className="group-hover:underline">My Address</span>
            </button>
            <Link
              to={{
                pathname: `user/${user.id}`,
              }}
              className="group p-1 text-[#3155FF]"
            >
              🤖 <span className="group-hover:underline">Profile</span>
            </Link>
          </div>
        </div>
        : <></>
    }
    <div
      className={
        "hidden absolute top-0 left-0 w-full h-full backdrop-blur z-10"
        + " md:block"
      }
    />
    <div
      className={
        "relative flex flex-col items-center gap-5 py-4"
        + " md:flex-row md:items-start"
      }
    >
      <div className="flex flex-col items-center">
        <div className="relative w-20 h-20 rounded-full border border-[#CDCDCD] overflow-hidden">
          {
            !user
              ? <div
                className={
                  "skeleton-wrapper !absolute top-0 left-0 w-20 h-20 bg-gray-600 transform-opacity duration-200 ease-in-out"
                  + (isImageLoaded ? " opacity-0" : " opacity-100")
                }
              />
              : <>
                <div
                  className={
                    "skeleton-wrapper !absolute top-0 left-0 w-20 h-20 bg-gray-600 transform-opacity duration-200 ease-in-out"
                    + (isImageLoaded ? " opacity-0" : " opacity-100")
                  }
                />
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="avatar-image w-auto h-20 object-contain"
                  onLoad={() => setIsImageLoaded(true)}
                />
              </>
          }
        </div>
        {
          user
            ? <span className="text-gray-300 text-[11px] mt-px block">{ user.id }</span>
            : <></>
        }
      </div>
      {
        user
          ? <div>
            <div>
              <span className="text-xs text-gray-600">Username</span>
              <p>{ user.username }</p>
            </div>
            <div>
              <span className="text-xs text-gray-600">Name</span>
              <p>{ user.first_name } { user.last_name }</p>
            </div>
          </div>
          : <div className="w-full">
            <div className="w-full">
              <span className="text-xs text-gray-600">Username</span>
              <div className="skeleton-wrapper w-full h-5 min-h-5 bg-gray-600 transform-opacity duration-200 ease-in-out" />
            </div>
            <div className="w-full">
              <span className="text-xs text-gray-600">Name</span>
              <div className="skeleton-wrapper w-full h-5 min-h-5 bg-gray-600 transform-opacity duration-200 ease-in-out" />
            </div>
          </div>
      }
      {
        user
          ? <div
              className={
                "flex w-full justify-between mt-5"
                + " md:hidden"
              }
            >
            <button
              className="group p-1 text-[#3155FF]"
              onClick={onSelectAddress ? () => onSelectAddress(user) : undefined}
            >
              🏠 <span className="group-hover:underline">My Address</span>
            </button>
            <Link
              to={{
                pathname: `user/${user.id}`,
              }}
              className="group p-1 text-[#3155FF]"
            >
              🤖 <span className="group-hover:underline">Profile</span>
            </Link>
          </div>
          : <></>
      }
    </div>
  </div>
}