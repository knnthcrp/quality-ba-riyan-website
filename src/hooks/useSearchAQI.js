import { useState, useRef, useCallback } from 'react';
import { getCityDataByName } from '../services/iqairService';

// Metro Manila cities for fuzzy hint matching (optional)
const METRO_MANILA_CITIES = [
    'Manila', 'Quezon City', 'Caloocan', 'Las Piñas', 'Makati',
    'Malabon', 'Mandaluyong', 'Marikina', 'Muntinlupa', 'Navotas',
    'Parañaque', 'Pasay', 'Pasig', 'Pateros', 'San Juan',
    'Taguig', 'Valenzuela',
];

/**
 * Validates raw user input before hitting the API.
 * Returns { valid: true } or { valid: false, message: string }
 */
function validateInput(raw) {
    const trimmed = raw.trim();

    if (!trimmed) {
        return { valid: false, message: 'Please enter a city name to search.' };
    }

    if (trimmed.length < 2) {
        return { valid: false, message: 'Please enter at least 2 characters.' };
    }

    // Reject strings that look like gibberish (no vowels in a long word)
    if (trimmed.length > 4 && !/[aeiouAEIOU]/.test(trimmed)) {
        return { valid: false, message: 'That doesn\'t look like a valid city name.' };
    }

    return { valid: true, trimmed };
}

/**
 * useSearchAQI
 *
 * Manages the search query input and controlled fetch lifecycle:
 * - Client-side validation (empty, too short, pattern)
 * - Debounce guard (ignores duplicate in-flight requests)
 * - Preserves last successful data if a search fails
 * - Reports inline validation errors and API errors separately
 *
 * @param {Function} onSuccess - (data, locationName) => void — called with new AQI data
 */
const useSearchAQI = (onSuccess) => {
    const [query, setQuery] = useState('');
    const [validationError, setValidationError] = useState(null); // client-side error
    const [searchError, setSearchError] = useState(null);         // API / not-found error
    const [isSearching, setIsSearching] = useState(false);

    const inFlightRef = useRef(false); // prevent duplicate in-flight requests

    const search = useCallback(async (rawQuery) => {
        // 1. Clear previous errors
        setValidationError(null);
        setSearchError(null);

        // 2. Client-side validation
        const validation = validateInput(rawQuery ?? query);
        if (!validation.valid) {
            setValidationError(validation.message);
            return;
        }

        const cityQuery = validation.trimmed;

        // 3. Guard: block duplicate concurrent requests
        if (inFlightRef.current) return;
        inFlightRef.current = true;
        setIsSearching(true);

        try {
            const data = await getCityDataByName(cityQuery);

            // 4. Validate response shape
            if (!data || typeof data.aqi === 'undefined' && !data?.current?.pollution) {
                setSearchError('Location not found. Try a Metro Manila city like Makati or Taguig.');
                return;
            }

            // 5. Success — propagate to parent
            const name = data.city || cityQuery;
            onSuccess(data, name);
            setQuery(''); // clear input on success

        } catch (err) {
            // Preserve whatever data the parent already has; just show inline error
            const msg = err?.message || '';

            if (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('no station')) {
                setSearchError(`"${cityQuery}" wasn't found. Try a Metro Manila city like Makati, Taguig, or Quezon City.`);
            } else if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('429')) {
                setSearchError('Too many requests. Please wait a moment and try again.');
            } else {
                setSearchError('Search failed. Check your connection and try again.');
            }
        } finally {
            setIsSearching(false);
            inFlightRef.current = false;
        }
    }, [query, onSuccess]);

    const handleSubmit = useCallback((e) => {
        if (e?.preventDefault) e.preventDefault();
        search(query);
    }, [query, search]);

    const handleQueryChange = useCallback((value) => {
        setQuery(value);
        // Clear errors as soon as user starts typing again
        if (validationError) setValidationError(null);
        if (searchError) setSearchError(null);
    }, [validationError, searchError]);

    const clearErrors = useCallback(() => {
        setValidationError(null);
        setSearchError(null);
    }, []);

    // Expose a `triggerSearch` for programmatic calls (e.g., map city click)
    const triggerSearch = useCallback((cityName) => {
        setQuery(cityName);
        search(cityName);
    }, [search]);

    const error = validationError || searchError; // single merged error for UI display

    return {
        query,
        setQuery: handleQueryChange,
        error,
        isSearching,
        handleSubmit,
        triggerSearch,
        clearErrors,
        metroManilaCities: METRO_MANILA_CITIES,
    };
};

export default useSearchAQI;
