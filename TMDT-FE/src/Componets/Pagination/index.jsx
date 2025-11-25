import { Pagination } from "antd";
import { useEffect, useState } from "react";
import * as ProductService from "../../Services/productService"


const PaginationComponents = ({ onChange, filters = {} }) => {
    const [totalProduct, setTotalProoduct] = useState();
    const [currentPage, setCurrentPage] = useState();

    const CountProduct = async () => {
        const res = await ProductService.countProduct(
            filters.CategoryId,
            filters.material,
            filters.priceRange,
            filters.sort
        )
        setTotalProoduct(res.count)
    }

    useEffect(() => {
        CountProduct()
        setCurrentPage(1)
    }, [filters])

    const handleCurrentPage = (e) => {
        setCurrentPage(e)
        if (onChange) {
            onChange(e)
        }
    };
    return (
        <>
            <Pagination
                onChange={handleCurrentPage}
                current={currentPage}
                pageSize={9}
                defaultCurrent={1}
                total={totalProduct}
                align="center"
                showSizeChanger={false}
            />
        </>
    );
};

export default PaginationComponents;
