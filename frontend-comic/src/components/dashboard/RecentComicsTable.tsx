import React from "react";
import Image from "next/image";
import { FiEdit, FiTrash2 } from "react-icons/fi";

type ComicData = {
    id: number;
    title: string;
    author: string;
    views: number;
    status: "published" | "draft" | "review";
    lastUpdated: string;
    coverImage: string;
};

const RecentComicsTable = ({ comics }: { comics: ComicData[] }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-green-100 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 border-b border-green-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Truyện mới cập nhật</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-green-50 dark:bg-green-900/30">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">Truyện</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">Tác giả</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">Lượt xem</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">Cập nhật</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-green-100 dark:divide-gray-700">
                        {comics.map((comic) => (
                            <tr key={comic.id} className="hover:bg-green-50/50 dark:hover:bg-green-900/10">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                                            <Image
                                                src={comic.coverImage}
                                                alt={comic.title}
                                                width={40}
                                                height={40}
                                                className="rounded-md object-cover"
                                            />
                                        </div>
                                        <div className="font-medium text-gray-800 dark:text-gray-200">{comic.title}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{comic.author}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{comic.views.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${comic.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400' :
                                            comic.status === 'draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                                                'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400'}`}>
                                        {comic.status === 'published' ? 'Đã xuất bản' :
                                            comic.status === 'draft' ? 'Bản nháp' : 'Đang xét duyệt'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{comic.lastUpdated}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-green-600 hover:text-green-800 mr-3 flex items-center dark:text-green-500 dark:hover:text-green-400">
                                        <FiEdit className="mr-1" size={16} />
                                        Sửa
                                    </button>
                                    <button className="text-rose-500 hover:text-rose-700 flex items-center dark:text-rose-400 dark:hover:text-rose-300">
                                        <FiTrash2 className="mr-1" size={16} />
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentComicsTable; 