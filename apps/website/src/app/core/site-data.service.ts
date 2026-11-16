import { Injectable, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { API_ROUTES } from '@puvin/shared-config';
import type { ApiSuccess, PublicSiteDto } from '@puvin/shared-types';

/**
 * Global site payload (branding, profile, homepage content). Fetched once per render;
 * on the server it is captured in TransferState so hydration does not refetch.
 */
@Injectable({ providedIn: 'root' })
export class SiteDataService {
  private readonly resource = httpResource<ApiSuccess<PublicSiteDto>>(() => API_ROUTES.publicSite);

  readonly site = computed(() => (this.resource.hasValue() ? this.resource.value().data : null));
  readonly loading = this.resource.isLoading;
  readonly error = this.resource.error;

  reload(): void {
    this.resource.reload();
  }
}
