import FilterByCategory from "../Filters/FilterByCategory/FilterByCategory";

function ProductFilter ({filters, onChange}){
    const handleFilterCategory =(CategoryId) =>{
        if(!onChange) return;

        const newFilters = {
            ...filters,
            CategoryId
        }
        onChange(newFilters)

    }

    return(
        <>
            <FilterByCategory  onChange={handleFilterCategory} activeCategoryId={filters.CategoryId}/>          
        </>
    )
}
export default ProductFilter;