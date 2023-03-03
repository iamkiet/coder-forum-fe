import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import React, { useMemo } from 'react';
import { useInfiniteQuery, useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import { createComment, getCommentReplies } from '../../../../apis';

const Comment = ({ record }) => {
  const { id: postId } = useParams();
  const [commentForm] = Form.useForm();
  const { resetFields } = commentForm;
  const { data, fetchNextPage, isFetching, refetch } = useInfiniteQuery({
    queryKey: ['get-comment-replies', { commentId: record._id }],
    queryFn: ({ queryKey, pageParam = 0 }) =>
      getCommentReplies(queryKey[1], pageParam),
    getNextPageParam: (lastPage, pages) => {
      return pages.length || 0;
    },
    retry: 0,
    refetchOnWindowFocus: false,
    enabled: false,
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

  const renderReplies = useMemo(() => {
    if (data && data.pages.length) {
      const x = flatten(data.pages);
      return x.map((comment, index) => (
        <Typography.Text key={index}>
          Anonymous: {comment.message}
        </Typography.Text>
      ));
    }
    return <></>;
  }, [data]);

  const hasReplies = useMemo(() => {
    return data && data.pages.length;
  }, [data]);

  console.log(record);

  return (
    <Skeleton loading={isFetching} style={{ margin: '20px' }}>
      <div>
        {record.author}: {record.message}
      </div>
      <div>
        <Typography.Text>Reply region</Typography.Text>
      </div>
      <Space>
        <Button type="link" onClick={() => refetch()} disabled={hasReplies}>
          show reply
        </Button>
      </Space>
      <Space direction="vertical">
        {renderReplies}
        {hasReplies && (
          <Button type="primary" onClick={() => fetchNextPage()}>
            Show more comment
          </Button>
        )}
      </Space>
      <Card title="Add reply comment">
        <Form
          form={commentForm}
          layout="vertical"
          onFinish={(validatedValues) => {
            const data = {
              post: postId,
              message: validatedValues.message,
              parentId: record._id,
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

      <Divider />
    </Skeleton>
  );
};

export default Comment;
