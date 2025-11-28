// Helper để tạo date filter từ query params
const createDateFilter = (req) => {
    const { startDate, endDate, period } = req.query;
    let dateFilter = {};
    const now = new Date();

    // Priority 1: Custom date range
    if (startDate && endDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        dateFilter = {
            createdAt: {
                $gte: start,
                $lte: end
            }
        };
    }
    // Priority 2: Predefined periods (chỉ khi có period và không phải 'all')
    else if (period && period !== 'all') {
        switch (period) {
            case 'today':
                const todayStart = new Date(now);
                todayStart.setHours(0, 0, 0, 0);
                dateFilter = {
                    createdAt: {
                        $gte: todayStart
                    }
                };
                break;

            case 'week':
                const weekStart = new Date(now);
                weekStart.setDate(weekStart.getDate() - 7);
                weekStart.setHours(0, 0, 0, 0);
                dateFilter = {
                    createdAt: {
                        $gte: weekStart
                    }
                };
                break;

            case 'month':
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                monthStart.setHours(0, 0, 0, 0);
                dateFilter = {
                    createdAt: {
                        $gte: monthStart
                    }
                };
                break;

            case 'year':
                const yearStart = new Date(now.getFullYear(), 0, 1);
                yearStart.setHours(0, 0, 0, 0);
                dateFilter = {
                    createdAt: {
                        $gte: yearStart
                    }
                };
                break;

            default:
                // No filter - return all data
                break;
        }
    }
    // No period or 'all' - return empty filter (get all data)

    return dateFilter;
};

module.exports = {
    createDateFilter
};
