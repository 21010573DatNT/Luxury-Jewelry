import { useEffect, useState } from "react";
import { Cascader } from "antd";
import { Radio } from "antd";
import "./NavbarComponents.scss";

const NavbarComponents = ({ filters, deselect, onChange }) => {
    const optionsSort = [
        { value: "price-asc", label: "Sắp xếp giá tăng dần" },
        { value: "price-desc", label: "Sắp xếp giá giảm dần" },
        { value: "name-asc", label: "Sắp xếp theo tên A-Z" },
        { value: "name-desc", label: "Sắp xếp theo tên Z-A" },
    ];

    const optionsMaterial = [
        { value: "Bạc", label: "Bạc" },
        { value: "Vàng", label: "Vàng" },
        { value: "Đá quý", label: "Đá quý" },
    ];

    const optionPriceRange = [
        { value: "0-500000", label: "Dưới 500k" },
        { value: "500000-1000000", label: "Từ 500k đến 1 triệu" },
        { value: "1000000-2000000", label: "Từ 1 triệu đến 2 triệu" },
        { value: "2000000-5000000", label: "Từ 2 triệu đến 5 triệu" },
        { value: "5000000-1000000000", label: "Trên 5 triệu" },
    ];

    const [material, setMaterial] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [sort, setSort] = useState("");

    const onChangeMaterial = (e) => {
        const value = e.target.value;
        if (material === value) {
            setMaterial("");
            onChange({
                ...filters,
                material: "",
            });
        } else {
            setMaterial(value);
            onChange({
                ...filters,
                material: value,
            });
        }
    };

    const onChangePriceRange = (e) => {
        const value = e.target.value;
        if (priceRange === value) {
            setPriceRange("");
            onChange({
                ...filters,
                priceRange: "",
            });
        } else {
            setPriceRange(value);
            onChange({
                ...filters,
                priceRange: value,
            });
        }
    };
    const onChangeSort = (keysort) => {
        if (keysort && keysort.length > 0) {
            setSort(keysort[0]);
            onChange({
                ...filters,
                sort: keysort[0],
            });
        } else {
            setSort("");
            onChange({
                ...filters,
                sort: "",
            });
        }
    };

    useEffect(() => {
        if (deselect) {
            setMaterial(null);
            setPriceRange(null);
        }
    }, [deselect]);



    return (
        <div className="navbar">
            <Cascader
                options={optionsSort}
                onChange={onChangeSort}
                placeholder="Please select"
                onSearch={(value) => console.log(value)}
            />

            <div className="navbar-material">
                <h3>Chất liệu</h3>
                <Radio.Group onChange={onChangeMaterial} value={material}>
                    {optionsMaterial.map((option) => (
                        <div key={option.value} className="material-option">
                            <Radio value={option.value}>
                                <p className="material">{option.label}</p>
                            </Radio>
                        </div>
                    ))}
                </Radio.Group>
            </div>

            <div className="navbar-price-range">
                <h3>Mức giá</h3>
                <Radio.Group onChange={onChangePriceRange} value={priceRange}>
                    {optionPriceRange.map((option) => (
                        <div key={option.value} className="price-range-option">
                            <Radio value={option.value}>
                                <p className="price-range">{option.label}</p>
                            </Radio>
                        </div>
                    ))}
                </Radio.Group>
            </div>
        </div>
    );
};

export default NavbarComponents;
