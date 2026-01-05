/**
 * User Service - Fetch user profile data from Starknet addresses
 */

export interface UserProfile {
  username: string;
  alias: string;
  address: string;
} 

/**
 * Fetch user profile data for a Starknet address
 * In a real app, this would query a backend API or smart contract
 * For now, it generates default values based on the address
 */
export const fetchUserProfile = async (address: string): Promise<UserProfile> => {
  try {
    // Simulate API call to fetch user data
    // In production, replace with actual API endpoint
    
    // Mock user data - in production this would come from your backend
    const userProfile: UserProfile = {
      username: `User_${address.slice(2, 8)}`, // Generate username from address
      alias: `Starknet_${address.slice(-4)}`, // Generate alias from last 4 chars
      address: address,
    };

    return userProfile;
  } catch (error) {
    // Return default profile on error
    return {
      username: `User_${address.slice(2, 8)}`,
      alias: `Starknet_${address.slice(-4)}`,
      address: address,
    };
  }
};

/**
 * Fetch user profile from backend API
 * Replace with actual API endpoint URL
 */
export const fetchUserProfileFromAPI = async (address: string): Promise<UserProfile> => {
  try {
    const response = await fetch(`/api/users/${address}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      username: data.username,
      alias: data.alias,
      address: address,
    };
  } catch (error) {
    // Fallback to generated profile
    return fetchUserProfile(address);
  }
};
