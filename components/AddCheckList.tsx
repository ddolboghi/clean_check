// "use client";

// import { useEffect, useState } from "react";
// import {
//   getAllRecentTodoListEachMember,
//   postWeeklyCheckList,
// } from "@/actions/addCheckList";
// import { Todo } from "@/utils/types";
// import { getDates, getStartDateAndEndDate } from "@/lib/dateTranslator";
// import { getAllProfiles, SupabaseProfile } from "@/actions/profile";

// const TodoItem = ({
//   todo,
//   onTodoChange,
//   onDurationChange,
//   onDelete,
//   allDays,
// }: {
//   todo: Todo;
//   onTodoChange: (todoId: number, value: string) => void;
//   onDurationChange: (todoId: number, days: { [key: string]: boolean }) => void;
//   onDelete: (todoId: number) => void;
//   allDays: string[];
// }) => {
//   const isEveryDay = Object.keys(todo.days).length === allDays.length;

//   const handleDayChange = (day: string) => {
//     let newDays = { ...todo.days };
//     if (day === "매일") {
//       if (isEveryDay) {
//         newDays = {};
//       } else {
//         allDays.forEach((d) => (newDays[d] = false));
//       }
//     } else {
//       if (day in newDays) {
//         delete newDays[day];
//       } else {
//         newDays[day] = false;
//       }
//     }
//     onDurationChange(todo.todoId, newDays);
//   };

//   return (
//     <section>
//       <label className="block font-semibold">할 일</label>
//       <input
//         className="border border-gray-300 rounded p-2 w-full"
//         value={todo.todo}
//         onChange={(e) => onTodoChange(todo.todoId, e.target.value)}
//       />
//       <label className="block font-semibold mt-4">주기</label>
//       <div className="flex flex-wrap">
//         {["매일", ...allDays].map((day) => (
//           <div key={day} className="flex items-center mr-4">
//             <input
//               type="checkbox"
//               checked={day === "매일" ? isEveryDay : day in todo.days}
//               onChange={() => handleDayChange(day)}
//               className="mr-2"
//             />
//             <label>{day}</label>
//           </div>
//         ))}
//       </div>
//       <button
//         type="button"
//         onClick={() => onDelete(todo.todoId)}
//         className="mt-4 bg-red-500 text-white rounded p-2 hover:bg-red-600"
//       >
//         todo 삭제
//       </button>
//     </section>
//   );
// };

// export default function AddCheckList() {
//   const [profiles, setProfiles] = useState<SupabaseProfile[]>([]);
//   const [loadingMaps, setLoadingMaps] = useState<{ [key: string]: boolean }>(
//     {}
//   );
//   const [errorMaps, setErrorMaps] = useState<{ [key: string]: string }>({});
//   const [successMaps, setSuccessMaps] = useState<{ [key: string]: string }>({});
//   const [todosMap, setTodosMap] = useState<{ [key: string]: Todo[] }>({});

//   const { startDate, endDate } = getStartDateAndEndDate();
//   const allDays = getDates(startDate, endDate);

//   useEffect(() => {
//     async function fetchProfiles() {
//       const allProfiles = await getAllProfiles();
//       const checkLists = await getAllRecentTodoListEachMember();
//       console.log(checkLists);
//       if (allProfiles && checkLists) {
//         setProfiles(allProfiles);
//         const initialTodosMap = Object.fromEntries(
//           allProfiles.map((profile) => [profile.id, checkLists[profile.id]])
//           //days는 따로 매핑 로직 구현해야함
//         );
//         setTodosMap({ ...initialTodosMap, ...todosMap });
//       }
//     }

//     fetchProfiles();
//   }, []);

//   const handleButtonClick = async (e: React.FormEvent, memberId: string) => {
//     e.preventDefault();
//     loadingMaps[memberId] = true;
//     setLoadingMaps({ ...loadingMaps });
//     errorMaps[memberId] = "";
//     setErrorMaps({ ...errorMaps });
//     successMaps[memberId] = "";
//     setSuccessMaps({ ...successMaps });

//     try {
//       await postWeeklyCheckList(todosMap[memberId], memberId);
//       successMaps[memberId] = "체크리스트가 성공적으로 생성되었습니다.";
//       setSuccessMaps({ ...successMaps });
//     } catch {
//       errorMaps[memberId] = "체크리스트 생성 중 오류가 발생했습니다.";
//       setErrorMaps({ ...errorMaps });
//     } finally {
//       loadingMaps[memberId] = false;
//       setLoadingMaps({ ...loadingMaps });
//     }
//   };

//   const handleTopicChange = (
//     memberId: string,
//     todoId: number,
//     value: string
//   ) => {
//     setTodosMap((prev) => ({
//       ...prev,
//       [memberId]: prev[memberId].map((todo) =>
//         todo.todoId === todoId ? { ...todo, topic: value } : todo
//       ),
//     }));
//   };

//   const handleTodoChange = (
//     memberId: string,
//     todoId: number,
//     value: string
//   ) => {
//     setTodosMap((prev) => ({
//       ...prev,
//       [memberId]: prev[memberId].map((todo) =>
//         todo.todoId === todoId ? { ...todo, todo: value } : todo
//       ),
//     }));
//   };

//   const handleDurationChange = (
//     memberId: string,
//     todoId: number,
//     days: { [key: string]: boolean }
//   ) => {
//     setTodosMap((prev) => ({
//       ...prev,
//       [memberId]: prev[memberId].map((todo) =>
//         todo.todoId === todoId ? { ...todo, days } : todo
//       ),
//     }));
//   };

//   const deleteTodo = (memberId: string, todoId: number) => {
//     setTodosMap((prev) => {
//       const updatedTodos = prev[memberId].filter(
//         (todo) => todo.todoId !== todoId
//       );
//       return {
//         ...prev,
//         [memberId]: updatedTodos.map((todo, index) => ({
//           ...todo,
//           todoId: index + 1,
//         })),
//       };
//     });
//   };

//   const addTodo = (memberId: string) => {
//     setTodosMap((prev) => {
//       const newTodoId = (prev[memberId]?.length || 0) + 1;
//       const newTodo = {
//         topic: "",
//         todoId: newTodoId,
//         todo: "",
//         days: {},
//       };
//       return { ...prev, [memberId]: [...(prev[memberId] || []), newTodo] };
//     });
//   };

//   return (
//     <div className="grid grid-cols-4 gap-2">
//       {profiles.map((profile) => (
//         <ul key={profile.id} className="">
//           <form
//             onSubmit={(e) => handleButtonClick(e, profile.id)}
//             className="max-w-lg mx-auto p-6 bg-white rounded shadow-md"
//           >
//             <p>
//               {profile.full_name} | {profile.email}
//             </p>
//             {todosMap[profile.id]?.map((todo) => (
//               <div
//                 key={todo.todoId}
//                 className="mb-6 border border-gray-300 rounded p-2"
//               >
//                 <label className="block font-semibold">피부 주제</label>
//                 <input
//                   value={todo.topic}
//                   onChange={(e) =>
//                     handleTopicChange(profile.id, todo.todoId, e.target.value)
//                   }
//                   className="border border-gray-300 rounded p-2 w-full mb-2"
//                 />
//                 <TodoItem
//                   todo={todo}
//                   onTodoChange={(todoId, value) =>
//                     handleTodoChange(profile.id, todoId, value)
//                   }
//                   onDurationChange={(todoId, days) =>
//                     handleDurationChange(profile.id, todoId, days)
//                   }
//                   onDelete={(todoId) => deleteTodo(profile.id, todoId)}
//                   allDays={allDays}
//                 />
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={() => addTodo(profile.id)}
//               className="mb-4 bg-green-500 text-white rounded p-2 hover:bg-green-600"
//             >
//               todo 추가
//             </button>
//             <button
//               type="submit"
//               disabled={loadingMaps[profile.id]}
//               className={`w-full rounded p-2 ${
//                 loadingMaps[profile.id]
//                   ? "bg-gray-400"
//                   : "bg-green-500 hover:bg-green-600"
//               } text-white`}
//             >
//               {loadingMaps[profile.id] ? "생성 중..." : "체크리스트 생성"}
//             </button>
//             {errorMaps[profile.id] && (
//               <p className="text-red-500 mt-2">{errorMaps[profile.id]}</p>
//             )}
//             {successMaps[profile.id] && (
//               <p className="text-green-500 mt-2">{successMaps[profile.id]}</p>
//             )}
//           </form>
//         </ul>
//       ))}
//     </div>
//   );
// }
