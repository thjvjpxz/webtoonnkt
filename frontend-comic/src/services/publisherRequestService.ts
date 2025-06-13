import { PublisherRequest, PublisherRequestStatus } from "@/types/publisherRequest";
import { fetchApi } from "./api";

export function getPublisherRequests(
  page: number,
  limit: number,
  search?: string,
  status?: PublisherRequestStatus
) {
  const params: Record<string, string | number> = { page, limit };

  if (search) params.search = search;
  if (status) params.status = status;

  return fetchApi<PublisherRequest[]>("/publisher-requests", {
    method: "GET",
    params
  });
}

export function updatePublisherRequest(id: string, status: PublisherRequestStatus) {
  return fetchApi<PublisherRequest>(`/publisher-requests/${id}`, {
    method: "PUT",
    data: { status },
  });
}
