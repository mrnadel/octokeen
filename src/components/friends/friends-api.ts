const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

export type FriendRequestAction = 'accept' | 'decline';

/** Accept or decline an incoming friend request. Resolves to whether the call succeeded. */
export async function respondToFriendRequest(
  requestId: string,
  action: FriendRequestAction,
): Promise<boolean> {
  const res = await fetch(`/api/friends/request/${requestId}`, {
    method: 'PATCH',
    headers: JSON_HEADERS,
    body: JSON.stringify({ action }),
  });
  return res.ok;
}

/** Withdraw a friend request the current user sent. */
export async function cancelFriendRequest(requestId: string): Promise<boolean> {
  const res = await fetch(`/api/friends/request/${requestId}`, { method: 'DELETE' });
  return res.ok;
}

/** Send a friend request to another user. */
export async function sendFriendRequest(receiverId: string): Promise<boolean> {
  const res = await fetch('/api/friends/request', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ receiverId }),
  });
  return res.ok;
}

/** Remove an existing friendship. */
export async function removeFriend(friendId: string): Promise<boolean> {
  const res = await fetch(`/api/friends/${friendId}`, { method: 'DELETE' });
  return res.ok;
}
