import { Form, Input, Rate, Typography, List, Button } from "antd";
import { useEffect, useState } from "react";
import "./Comment.scss";
import { UserOutlined } from "@ant-design/icons";
import { TakeUserID } from "../TakeUserID";
import * as CommentService from "../../Services/commentService";

function CommentProduct(prop) {
    const [comments, setComments] = useState([]);
    const [form] = Form.useForm();
    const product_id = prop.id;
    const product = prop.product;
    const infoUser = TakeUserID();
    const user_id = infoUser.user_id;

    const postComment = async (data) => {
        await CommentService.CommentPost(product_id, data);
    };

    useEffect(() => {
        setComments(Array.isArray(product?.comments) ? product.comments : []);
    }, [product]);

    const handleSubmitComment = (values) => {
        const data = {
            user_id: user_id,
            userName: infoUser.userName,
            comment: values.comment,
            rate: values.rate,
            createDate: new Date(),
        };
        postComment(data);
        setComments([...comments, data]);
        form.resetFields(); //Reset form khi thêm mới 1 comment
    };

    return (
        <div className="product-review" style={{ marginTop: "50px" }}>
            <h3>Đánh giá sản phẩm</h3>
            <Form form={form} layout="vertical" onFinish={handleSubmitComment}>
                <Form.Item
                    name="rate"
                    label="Đánh giá"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng chọn đánh giá sao!",
                        },
                    ]}
                >
                    <Rate />
                </Form.Item>
                <Form.Item name="comment" label="Bình luận">
                    <Input.TextArea
                        rows={4}
                        style={{
                            width: "",
                        }}
                        placeholder="Hãy chia sẻ cảm nhận của bạn..."
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Gửi đánh giá
                    </Button>
                </Form.Item>
            </Form>

            <List
                className="comment-list"
                header={`${comments.length} bình luận`}
                itemLayout="horizontal"
                dataSource={comments}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<UserOutlined />}
                            title={
                                <>
                                    {item.userName}{" "}
                                    <Rate
                                        disabled
                                        defaultValue={item.rate}
                                        style={{ fontSize: 14 }}
                                    />
                                </>
                            }
                            description={
                                <Typography.Paragraph>
                                    {item.comment}
                                </Typography.Paragraph>
                            }
                        />
                        <div>
                            {new Date(item.createDate).toLocaleDateString()}
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
}

export default CommentProduct;
