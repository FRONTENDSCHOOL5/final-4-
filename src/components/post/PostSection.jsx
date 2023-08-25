import React, { useState, useEffect, useContext } from 'react';
import { PostDeleteContext } from '../../pages/post/PostDeleteContext';
import { useNavigate } from 'react-router-dom';
import { Post } from '../../components/post/Post';
import { GridView, GridItem } from './postAlbum.style';
import { getUserPosts } from '../../api/postAPI';

const PostSection = ({ accountname, listView }) => {
	const { deletedPostId } = useContext(PostDeleteContext);
	const [posts, setPosts] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (accountname) {
			const fetchPostList = async () => {
				try {
					const response = await getUserPosts(accountname);
					setPosts(response.data.post);
				} catch (error) {
					console.error('데이터를 불러올 수 없습니다', error);
					throw error;
				}
			};
			setIsLoading(true);
			fetchPostList();
		}
	}, [accountname, deletedPostId]);

	return (
		<div>
			{isLoading &&
				(listView ? (
					posts &&
					posts.map((post, index) => <Post key={index} postId={post.id} />)
				) : (
					<GridView>
						{posts &&
							posts
								.filter((post) => post.image !== '')
								.map((post, index) => (
									<GridItem
										key={index}
										image={post.image}
										onClick={() => navigate(`/post/view/${post.id}`)}
									/>
								))}
					</GridView>
				))}
		</div>
	);
};

export default PostSection;
