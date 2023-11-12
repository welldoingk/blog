
async function getData() {
  const formData = new FormData();
  const res = await fetch(`http://localhost:8080/api/selectPostList?id=1`, {
    method: "GET",
  });

  return res.json();
}

export default async function Posts() {
  const res = await getData();
  const postDtos = await res.postDtos;
  console.log(JSON.stringify(res));
  if (res.count == 0) {
    return <>조회된 데이터가 없습니다.</>;
  } else {
    return (
      <div>
        <table>
          <tr>
            <td>id</td>
            <td>title</td>
            <td>content</td>
            <td>boardId</td>
            <td>gbVal</td>
            <td>createAt</td>
            <td>modifiedAt</td>
            <td>viewCount</td>
            <td>username</td>
            <td>memberId</td>
            <td>orders</td>
          </tr>
          {postDtos.map((item: any) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.content}</td>
              <td>{item.boardId}</td>
              <td>{item.gbVal}</td>
              <td>{item.createAt}</td>
              <td>{item.modifiedAt}</td>
              <td>{item.viewCount}</td>
              <td>{item.username}</td>
              <td>{item.memberId}</td>
              <td>{item.orders}</td>
            </tr>
          ))}
        </table>
      </div>
    );
  }
}
