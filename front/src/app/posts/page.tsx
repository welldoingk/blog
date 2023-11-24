import Link from "next/"

interface Data {
  id: string
  title: string
  content: string
  boardId: string
  gbVal: string
  createAt: string
  modifiedAt: string
  viewCount: string
  username: string
  memberId: string
  orders: string
}

async function getData() {
  try {
    const res = await fetch(`http://localhost:8080/api/selectPostList?id=1`, {
      method: "GET",
    })
    return res.json()
  } catch (error) {
    console.log("error => " + error)
  }
}

export default async function Posts() {
  const res = await getData()
  console.log("return => ")
  console.log(JSON.stringify(res))

  if (res.count != 0) {
    return (
      <>
        <table className="min-w-full text-center text-sm font-light">
          <caption>Post</caption>
          <thead className="border-b font-medium dark:border-separate-500 bg-slate-500">
            <tr>
              <td className="border border-slate-600">id</td>
              <td className="border border-slate-600">title</td>
              <td className="border border-slate-600">content</td>
              <td className="border border-slate-600">boardId</td>
              <td className="border border-slate-600">gbVal</td>
              <td className="border border-slate-600">createAt</td>
              <td className="border border-slate-600">modifiedAt</td>
              <td className="border border-slate-600">viewCount</td>
            </tr>
          </thead>
          <tbody>
            {res &&
              res.postDtos.map((item: Data) => (
                <tr key={item.id}>
                  <td className="border border-slate-600">{item.id}</td>
                  <td className="border border-slate-600">{item.title}</td>
                  <td className="border border-slate-600">{item.content}</td>
                  <td className="border border-slate-600">{item.boardId}</td>
                  <td className="border border-slate-600">{item.gbVal}</td>
                  <td className="border border-slate-600">{item.createAt}</td>
                  <td className="border border-slate-600">{item.modifiedAt}</td>
                  <td className="border border-slate-600">{item.viewCount}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <section>
          <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
            <div className="shrink-0">
              <img
                className="h-12 w-12"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="img"
              />
            </div>
            <div>
              <div className="text-xl font-medium text-black">title</div>
              <p className="text-slate-500">message</p>
            </div>
          </div>
        </section>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
          <div className="flex flex-col space-y-4">
            {res &&
              res.postDtos.map((item: Data) => (
                <div
                  key={item.id}
                  className="flex flex-col p-4 bg-gray-800 border border-gray-800 shadow-md hover:text-green-500 text-gray-400 hover:shodow-lg rounded-2xl transition ease-in duration-500  transform hover:scale-105 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center mr-auto">
                      <div className="-space-x-5 flex ">
                        <img
                          src="https://tailwindcomponents.com/storage/avatars/njkIbPhyZCftc4g9XbMWwVsa7aGVPajYLRXhEeoo.jpg"
                          alt="aji"
                          className=" relative p-1 w-12 h-12 object-cover rounded-2xl border-2 border-gray-600 bg-gray-800"
                        />
                      </div>

                      <div className="flex flex-col ml-3 min-w-0">
                        <div className="font-medium leading-none text-gray-100">
                          {item.title}
                        </div>
                        <p className="text-sm text-gray-500 leading-none mt-1 truncate">
                          Jul 066, 2021, 8.25 PM{item.createAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col ml-3 min-w-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </>
    )
  } else {
    return <>조회된 데이터가 없습니다.</>
  }
}
