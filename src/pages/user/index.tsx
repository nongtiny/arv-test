import { CSSProperties, Suspense, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import { CSSTransition  } from 'react-transition-group';
import { Link } from 'react-router-dom';
import { UserService } from '../../services/UserService';
import { STATUS_OK } from '../../services/networkStatus';
import { TUserResponse } from '../../types/response';
import {
  fieldColumnSize,
  fieldColumnSizeMd,
  rowGap,
  rowGapMd,
  columnGap,
  columnGapMd,
  simpleTextField
} from './config';
import type { ActionFunction } from 'react-router';
import '../../styles/page-user.css';

export const loadUser: ActionFunction = async ({ request, params }) => {
  const userSessionStorage = sessionStorage.getItem('users')
  const savedUsers = userSessionStorage
    ? JSON.parse(userSessionStorage)
    : [];

  if (!savedUsers) {
    const response = await UserService.getRandomUserById(params.userId);
    if (response.status === STATUS_OK) {
      return { user: response.data };
    }
    return { user: null };
  }
  const foundedUserId = savedUsers.find((item: any) => params.userId && item.id.toString() === params.userId.toString())
  if (!foundedUserId) {
    const response = await UserService.getRandomUserById(params.userId);
    if (response.status === STATUS_OK) {
      return { user: response.data };
    }
    return { user: null };
  }
  return { user: foundedUserId };
};

const USER_CONTENT_CUSTOM_STYLES = {
  '--columns-size': `repeat(${fieldColumnSize}, minmax(0, 1fr))`,
  '--columns-size-md': `repeat(${fieldColumnSizeMd}, minmax(0, 1fr))`,
  '--row-gap': rowGap,
  '--row-gap-md': rowGapMd,
  '--column-gap': columnGap,
  '--column-gap-md': columnGapMd,
} as CSSProperties;

export const UserPage = () => {
  const { user } = useLoaderData() as { user: TUserResponse | null };
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, []);

  if (!user) {
    return <div>NULL</div>;
  }
  return <Suspense fallback={null}>
    <div className="base-container pt-5">
      <Link
        to="/"
        className="block mb-5 underline font-bold"
      >
        Back to start
      </Link>
    </div>
    <div className="w-full min-h-vh flex flex-col items-center">
      <div className="relative w-[200px] h-[200px] border rounded-full border border-[#CDCDCD] overflow-hidden">
        <CSSTransition
          in={!isImageLoaded}
          timeout={200}
          classNames="fade"
        >
          <div
            className={
              "skeleton-wrapper !absolute top-0 left-0 w-[200px] h-[200px] bg-gray-600 transform-opacity duration-200 ease-in-out"
              + (isImageLoaded ? " opacity-0" : " opacity-100")
            }
          />
        </CSSTransition>
        <img
          src={user.avatar}
          alt={user.username}
          className=" w-[200px] h-[200px] object-contain"
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>
      <div className="base-container py-10">
        <div
          style={{
            ...USER_CONTENT_CUSTOM_STYLES
          }}
          className="user-content-wrapper"
        >
          {
            simpleTextField.map((field, index) => {
              const fieldKey = field.key as any;
              const tmpUser = user as any;
              return <div
                key={`userField${index}`}
                className={field.singleLine ? "col-span-full" : ""}
              >
                <span className="text-xs text-gray-600">{ field.label }</span>
                <div>{ tmpUser[fieldKey] }</div>
              </div>
            })
          }
        </div>
      </div>
    </div>
  </Suspense>
}
