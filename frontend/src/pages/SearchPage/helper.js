const baseURL = import.meta.env.VITE_BASE_URL;
export default function helper(query, setData, setCountDocs, page, setTotalPage)

{
    if (!query.trim()) {
            alert("enter any keyword for search")
            return
        }
        fetch(`${baseURL}/api/v1/videos/search/keyword?title=${query.trim()}&page=${page}`, {
            method: "GET",
            credentials: "include"
            
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data.data)
                setData(data.data.videos)
                setCountDocs(data.data.countDocuments)
                setTotalPage(data.data.totalPages)
            })
            .catch(err => {
                console.log(err)
            })
}