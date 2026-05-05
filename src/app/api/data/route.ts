import { NextRequest, NextResponse } from "next/server";
import { mockUsers } from "@/lib/mock-data";
import { applyFilters, applySort, applyPagination } from "@/lib/utils";
import { FilterItem, SortField } from "@/types/data-grid.types";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const sortField = (searchParams.get("sortField") || undefined) as SortField | undefined;
    const sortDirection = (searchParams.get("sortDirection") || undefined) as
        | "asc"
        | "desc"
        | undefined;

    let filters: FilterItem[] = [];
    try {
        const filtersRaw = searchParams.get("filters");
        if (filtersRaw) filters = JSON.parse(filtersRaw);
    } catch {
        filters = [];
    }

    // ═══════════════════════════════════════
    // Simulated error scenarios (for testing Error state in frontend)
    // ═══════════════════════════════════════

    // Simulate random server error (10% chance)
    if (Math.random() < 0.1) {
        return NextResponse.json(
            { message: "Internal server error. Please try again." },
            { status: 500 }
        );
    }

    // 300ms Delay For Network Simulation
    await new Promise((r) => setTimeout(r, 300));

    // Filter → Sort → Paginate
    const filtered = applyFilters(mockUsers, filters);
    const sorted = applySort(filtered, sortField, sortDirection);
    const { paginatedData, totalPages } = applyPagination(sorted, page, pageSize);

    return NextResponse.json({
        data: paginatedData,
        totalCount: filtered.length,
        page,
        pageSize,
        totalPages,
    });
}