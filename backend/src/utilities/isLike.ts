export function isLike(string: string, pattern: string) {
    if (string == "" || pattern == "") {
        return true;
    }
    
    pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  
    pattern = pattern.replace(/%/g, ".*").replace(/_/g, ".");
  
    const regex = new RegExp(`^${pattern}$`, "i");

    return regex.test(string);
}
