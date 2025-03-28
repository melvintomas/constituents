export default function useConstituentsData() {


  const getConstituents = async ({
    pageIndex,
    pageSize,
    columnFilters,
    globalFilter,
    sorting,
  }: {
    pageIndex: number;
    pageSize: number;
    columnFilters: any;
    globalFilter: string;
    sorting: any;
  }) => {

    const fetchURL = new URL('/api/constituents', location.origin);

    fetchURL.searchParams.set(
      'start',
      `${pageIndex * pageSize}`,
    );
    fetchURL.searchParams.set('size', `${pageSize}`);
    fetchURL.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
    fetchURL.searchParams.set('globalFilter', globalFilter ?? '');
    fetchURL.searchParams.set('sorting', JSON.stringify(sorting ?? []));
    const res = await fetch(fetchURL);
    const data = await res.json();
    return data;
  }

  const updateConstituent = async (data: any) => {

    const res = await fetch(`/api/constituents/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const updatedData = await res.json();
    return updatedData;
  }

  const createConstituent = async (data: any) => {
    const res = await fetch("/api/constituents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const newData = await res.json();
    // if the email already exists, update the constituent
    if (newData.error === "A record with this email already exists.") {
      return updateConstituent({
        ...data,
        id: newData.existingConstituent.id,
      })
    }
    return newData;
  }

  const deleteConstituent = async (id: string) => {
    const res = await fetch(`/api/constituents/${id}`, {
      method: "DELETE",
    });
    return res.ok;
  }


  const downloadCSV = async () => {
    const res = await fetch("/api/constituents/export", {
      headers: {
        "Content-Type": "text/csv",
        "Accept": "text/csv",
      },
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "constituents.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  return {
    getConstituents,
    updateConstituent,
    createConstituent,
    deleteConstituent,
    downloadCSV
  };
}

