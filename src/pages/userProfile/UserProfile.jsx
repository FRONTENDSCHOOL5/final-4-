import React from 'react';
import { ChatShare, ProfileButton } from '../../components/button/button.style';
import {
	ProfileWrapper,
	Intro,
	UserEmail,
	UserNickName,
	Follower,
	FollowerNumber,
	FollowerWrap,
	ProfileImgWrap,
	UserWrap,
	ProfileButtonWrap,
	ProfilePageWrapper,
} from './userProfile.style';
import { ProfileImage } from '../profileSetup/profileSetup.style';
import profilePic from '../../assets/image/profilePic.png';
import {
	Backspace,
	NavbarWrap,
	OptionModalTab,
} from '../../components/navbar/navbar.style';
import {
	ModalWrap,
	ModalText,
	DarkBackground,
	CheckModalWrap,
	CheckMsg,
	CheckButtonWrap,
	CheckLogout,
} from '../../components/modal/modal.style';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { API_URL } from '../../api';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductsForSale from './ProductsForSale';
export default function UserProfile() {
	const location = useLocation();
	const navigate = useNavigate();
	const [profile, setProfile] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isModal, setIsModal] = useState(false);
	const [isCheckModal, setIsCheckModal] = useState(false);
	const [isFollow, setIsFollow] = useState();

	const accountname = location.state.accountname;

	const url = API_URL;
	const token = localStorage.getItem('token');

	const profileData = async () => {
		try {
			const res = await axios({
				method: 'GET',
				url: `${url}/profile/${accountname}`,
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-type': 'application/json',
				},
			});
			setIsLoading(true);
			setProfile(res.data);
			console.log(profile);
		} catch (error) {
			console.log('에러입니다', error);
		}
	};

	useEffect(() => {
		profileData();
	}, [isFollow]);

	useEffect(() => {
		if (isLoading === true) {
			profile.profile.isfollow === true
				? setIsFollow(true)
				: setIsFollow(false);
		}
	}, [isLoading]);

	const handleImgError = (e) => {
		e.target.src = profilePic;
	};

	const handleFollowChange = async (e) => {
		e.preventDefault();
		if (isFollow === false) {
			try {
				const res = await axios({
					method: 'POST',
					url: `${url}/profile/${accountname}/follow`,
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-type': 'application/json',
					},
				});
				console.log(res.data.profile.isfollow);
				setIsFollow(true);
			} catch (error) {
				console.log('에러입니다', error);
			}
		} else {
			try {
				const res = await axios({
					method: 'DELETE',
					url: `${url}/profile/${accountname}/unfollow`,
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-type': 'application/json',
					},
				});
				console.log(res.data.profile.isfollow);
				setIsFollow(false);
			} catch (error) {
				console.log('에러입니다', error);
			}
		}
	};

	const handleModalOpen = (e) => {
		e.preventDefault();
		setIsModal(true);
	};

	const handleModalClose = (e) => {
		e.preventDefault();
		// e.currentTarget 현재 handleModalClose가 부착된 요소
		// e.target 내가 클릭한 자식 요소
		if (e.target === e.currentTarget) {
			setIsModal(false);
			setIsCheckModal(false);
		}
	};

	const handleCheckModal = (e) => {
		e.preventDefault();
		setIsCheckModal(true);
	};

	const accountLogout = (e) => {
		e.preventDefault();
		localStorage.removeItem('token');
		navigate('/');
	};

	return (
		<>
			<ProfilePageWrapper>
				<ProfileWrapper>
					<NavbarWrap spaceBetween>
						<Backspace
							onClick={() => {
								navigate(-1);
							}}
						/>
						<OptionModalTab onClick={handleModalOpen} />
					</NavbarWrap>
					{isLoading && (
						<>
							<ProfileImgWrap>
								<FollowerWrap
									to='/followers'
									state={{
										accountname: accountname,
									}}
								>
									<FollowerNumber followers>
										{profile.profile.followerCount}
									</FollowerNumber>
									<Follower>followers</Follower>
								</FollowerWrap>

								<ProfileImage
									style={{ width: '110px', height: '110px' }}
									src={profile.profile.image}
									onError={handleImgError}
									alt=''
								></ProfileImage>

								<FollowerWrap
									to='/followings'
									state={{ accountname: accountname, token: token }}
								>
									<FollowerNumber>
										{profile.profile.followingCount}
									</FollowerNumber>
									<Follower>followings</Follower>
								</FollowerWrap>
							</ProfileImgWrap>

							<UserWrap>
								<UserNickName>{profile.profile.accountname}</UserNickName>
								<UserEmail>@ {profile.profile.accountname}</UserEmail>
								<Intro>{profile.profile.intro}</Intro>
							</UserWrap>

							<ProfileButtonWrap>
								<ChatShare type='button' chatting />
								<ProfileButton
									follow={isFollow === true ? false : true}
									type='button'
									onClick={handleFollowChange}
								>
									{isFollow === true ? '팔로우 취소' : '팔로우'}
								</ProfileButton>
								<ChatShare type='button' />
							</ProfileButtonWrap>
						</>
					)}
				</ProfileWrapper>

				<ProductsForSale />
				{isModal && (
					<DarkBackground onClick={handleModalClose}>
						<ModalWrap>
							<ModalText>설정 및 개인정보</ModalText>
							<ModalText onClick={handleCheckModal}>로그아웃</ModalText>
						</ModalWrap>
					</DarkBackground>
				)}
				{isCheckModal && (
					<DarkBackground onClick={handleModalClose}>
						<CheckModalWrap>
							<CheckMsg>로그아웃하시겠어요?</CheckMsg>
							<CheckButtonWrap>
								<CheckLogout onClick={handleModalClose}>취소</CheckLogout>
								<CheckLogout check onClick={accountLogout}>
									로그아웃
								</CheckLogout>
							</CheckButtonWrap>
						</CheckModalWrap>
					</DarkBackground>
				)}
			</ProfilePageWrapper>
		</>
	);
}
