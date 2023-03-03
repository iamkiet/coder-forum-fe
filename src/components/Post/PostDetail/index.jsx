import {
  Button,
  Card,
  Form,
  Input,
  message,
  Skeleton,
  Timeline,
  Typography,
} from 'antd';
import React, { useEffect, useMemo } from 'react';
import { useInfiniteQuery, useMutation } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { createComment, getPostComments } from '../../../apis';
import Comment from './Comment';

const PostDetail = () => {
  let { id: postId } = useParams();
  const navigate = useNavigate();
  const [commentForm] = Form.useForm();
  const { resetFields } = commentForm;

  const {
    data: postComments,
    fetchNextPage,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['get-post-comments', { postId }],
    queryFn: ({ queryKey, pageParam = 0 }) =>
      getPostComments(queryKey[1], pageParam),
    getNextPageParam: (lastPage, pages) => {
      return pages.length || 0;
    },
    retry: 0,
    refetchOnWindowFocus: false,
    enabled: false,
    onError: ({ error, status }) => {
      const errorMessage = JSON.stringify(error.message || error);
      message.error(errorMessage);
      if (status === 401) {
        navigate('/auth/login');
      }
    },
  });

  const { mutate: mutateCreateComment } = useMutation(createComment, {
    onSuccess: () => {
      message.success('Comment created');
      refetch();
      resetFields();
    },
    onError: (err) => {
      const errorMessage = JSON.stringify(err.message || err);
      message.error(errorMessage);
      resetFields();
    },
  });

  const flatten = (arr) => {
    const results = arr.reduce((total, item) => {
      total = total.concat(item.data);
      return total;
    }, []);
    return results;
  };

  useEffect(() => {
    if (postId) {
      refetch();
    }
  }, [postId, refetch]);

  const renderItem = useMemo(() => {
    if (postComments && postComments.pages.length) {
      const x = flatten(postComments.pages);
      return x.map((comment, index) => ({
        color: 'green',
        children: <Comment key={index} record={comment} />,
      }));
    }
    return <></>;
  }, [postComments]);

  return (
    <div>
      <Typography>Post ID: {postId}</Typography>
      Comment
      <Skeleton loading={isFetching}>
        <Timeline items={renderItem} />
      </Skeleton>
      <Button type="primary" onClick={() => fetchNextPage()}>
        Show more comment
      </Button>
      <Card title="Add new comment">
        <Form
          form={commentForm}
          layout="vertical"
          onFinish={(validatedValues) => {
            const data = {
              post: postId,
              message: validatedValues.message,
            };
            mutateCreateComment(data);
          }}
        >
          <Form.Item
            name="message"
            label="Message"
            rules={[
              {
                required: true,
                message: 'Please input your message!',
              },
            ]}
          >
            <Input placeholder="Type your comment" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">Comment</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PostDetail;
